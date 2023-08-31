import * as colors from "https://deno.land/std@0.200.0/fmt/colors.ts"
import { encodeHex } from "https://deno.land/x/hexes@v0.1.0/encode.ts"
import { codegen } from "./codegen.ts"

export interface BuildOpts {
  wabtArgs: string[]
  dynamic: boolean
  check: boolean
}

export type BuildStatus = Xor<
  | { type: "dirty"; ok: false }
  | { type: "clean" | "built"; bytes: number; ok: true }
  | { type: "going"; controller: AbortController }
  | { type: "error"; error: string; ok: false }
>

type Expand<T> = T extends T ? { [K in keyof T]: T[K] } : never
type Xor<T, K extends keyof any = T extends T ? keyof T : never> = T extends T
  ? Expand<T & Partial<Record<Exclude<K, keyof T>, never>>>
  : never

export async function build(
  watPath: string,
  { wabtArgs, dynamic, check }: BuildOpts,
  signal?: AbortSignal,
): Promise<BuildStatus> {
  try {
    const wasmCmd = await new Deno.Command("wat2wasm", {
      args: [watPath, ...wabtArgs, "--output=-"],
      stdout: "piped",
      stderr: "piped",
      stdin: "null",
      env: {
        FORCE_COLOR: colors.getColorEnabled() ? "1" : "0",
      },
      signal,
    }).output()

    if (!wasmCmd.success) {
      const error = new TextDecoder().decode(wasmCmd.stderr)
      return { type: "error", error, ok: false }
    }

    const wasm = wasmCmd.stdout
    const code = codegen(wasm, dynamic)

    const hash = encodeHex(
      new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code))),
    )
    const generated = `@generated ${hash}`

    const outputPath = watPath + ".ts"
    const existing = await Deno.readTextFile(outputPath).catch(() => "")
    const clean = existing.includes(generated)

    const bytes = wasm.length

    if (check) {
      if (clean) {
        return { type: "clean", bytes, ok: true }
      } else {
        return { type: "dirty", ok: false }
      }
    } else {
      if (clean) {
        return { type: "clean", bytes, ok: true }
      } else {
        const file = `// ${generated}\n\n${code}`
        await Deno.writeTextFile(outputPath, file)
        return { type: "built", bytes, ok: true }
      }
    }
  } catch (e) {
    return { type: "error", error: Deno.inspect(e), ok: false }
  }
}
