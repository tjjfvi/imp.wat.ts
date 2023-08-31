import { parse } from "https://deno.land/std@0.200.0/flags/mod.ts"
import * as colors from "https://deno.land/std@0.200.0/fmt/colors.ts"
import { walk } from "https://deno.land/std@0.200.0/fs/walk.ts"
import { globToRegExp } from "https://deno.land/std@0.200.0/path/glob.ts"
import { relative } from "https://deno.land/std@0.200.0/path/relative.ts"
import { build, BuildOpts, BuildStatus } from "./build/build.ts"

const args = parse(Deno.args, {
  boolean: ["dynamic", "check", "watch"],
  collect: ["wabt-arg", "exclude"],
  string: ["wabt-arg", "exclude"],
})

const opts: BuildOpts = {
  wabtArgs: args["wabt-arg"],
  dynamic: args.dynamic,
  check: args.check,
}

const alwaysExclude = [".git"]

const include = args._.map((glob) => globToRegExp(glob as string))
const exclude = [...args.exclude, ...alwaysExclude].map((glob) => globToRegExp(glob as string))

if (!args.watch) {
  const paths: string[] = await scan()

  const statuses = new Map(
    await Promise.all(
      paths.map(async (path) => [path, await build(path, opts)] as const),
    ),
  )

  printStatuses(statuses)

  if (![...statuses.values()].every((status) => status.ok)) {
    Deno.exit(1)
  }
} else {
  watch()
}

async function watch() {
  let statuses = new Map<string, BuildStatus>(
    (await scan()).map((path) => [path, queueBuild(path)] as const),
  )

  print()

  for await (const event of Deno.watchFs(".")) {
    let dirty = false
    if (event.flag === "rescan") {
      const paths = await scan()
      statuses.forEach((status) => status.controller?.abort())
      statuses = new Map(paths.map((path) => [path, statuses.get(path) ?? queueBuild(path)]))
      dirty = true
    } else {
      for (let path of event.paths) {
        path = relative(Deno.cwd(), path)
        if (!match(path)) continue

        if (event.kind === "create" || event.kind === "modify" || event.kind === "remove") {
          try {
            Deno.statSync(path)
            statuses.get(path)?.controller?.abort()
            statuses.set(path, queueBuild(path))
            dirty = true
          } catch {}
        }
      }
    }

    if (dirty) {
      for (const [path, status] of statuses) {
        if (status.type === "built") {
          statuses.set(path, { ...status, type: "clean" })
        }
      }
      print()
    }
  }

  function queueBuild(path: string): BuildStatus {
    const controller = new AbortController()
    build(path, opts, controller.signal).then((status) => {
      if (!controller.signal.aborted) {
        statuses.set(path, status)
        print()
      }
    })
    return { type: "going", controller }
  }

  function print() {
    Deno.stdout.writeSync(new Uint8Array([0x1b, 0x63]))
    printStatuses(statuses)
    console.log(colors.gray("\nWatching... "))
  }
}

function match(path: string) {
  return include.some((x) => x.test(path)) && !exclude.some((x) => x.test(path))
}

async function scan(): Promise<string[]> {
  const files = []

  for await (
    const entry of walk(".", {
      match: include,
      skip: exclude,
      includeDirs: false,
      includeSymlinks: false,
    })
  ) {
    files.push(entry.path)
  }

  return files.sort()
}

function printStatuses(statuses: Map<string, BuildStatus>) {
  for (const [path, status] of statuses) {
    const color = status.type === "built"
      ? colors.bgGreen
      : status.type === "clean"
      ? args.check ? colors.bgGreen : colors.bgBrightBlack
      : status.type === "dirty"
      ? colors.bgBrightRed
      : status.type === "error"
      ? colors.bgRed
      : colors.bgBlue
    const tag = colors.bold(color(` ${status.type.toUpperCase()} `))
    const extra = status.type === "built" || status.type === "clean"
      ? [colors.gray(`(${status.bytes} bytes)`)]
      : status.type === "error"
      ? ["\n" + status.error.trimEnd().replace(/^/gm, "  ")]
      : []
    console.log(tag, path, ...extra)
  }
}
