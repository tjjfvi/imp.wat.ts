import { parse } from "https://deno.land/std@0.200.0/flags/mod.ts"
import { expandGlob } from "https://deno.land/std@0.200.0/fs/expand_glob.ts"
import { relative } from "https://deno.land/std@0.200.0/path/relative.ts"
import { build } from "./build/build.ts"

const args = parse(Deno.args, {
  boolean: ["check"],
  collect: ["wabt-arg"],
  string: ["wabt-arg"],
})

const files: string[] = []

await Promise.all(args._.map(async (glob) => {
  for await (const entry of expandGlob(glob.toString())) {
    files.push(relative(Deno.cwd(), entry.path))
  }
}))

files.sort()

const results = await Promise.all(files.map((file) => build(file, args.check, args["wabt-arg"])))

if (results.some((ok) => !ok)) {
  Deno.exit(1)
}
