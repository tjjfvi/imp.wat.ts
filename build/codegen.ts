import { encodeHex } from "https://deno.land/x/hexes@v0.1.0/encode.ts"
import { identBase, reservedWords, stringifyName, stringifyProperty } from "./util.ts"

// @deno-types="./wasm.d.ts"
import { WebAssembly } from "./wasm.js"

export function codegen(wasm: Uint8Array) {
  const module = new WebAssembly.Module(wasm)

  // Identifiers used in the generated code:
  const usedWords = [
    "decodeHex",
    "wasm",
    "module",
    "instance",
    "imports",
  ]

  const wasmImports = WebAssembly.Module.imports(module)
  const wasmExports = WebAssembly.Module.exports(module)
  const identBases = [
    ...wasmImports.map((x) => identBase(x.name)),
    ...wasmExports.map((x) => identBase(x.name)),
  ]
  const identSuffixes = new Map<string, number>()

  const importModules = new Map<string, { ident: string; name: string; type: string }[]>()

  for (const imp of wasmImports) {
    const array = importModules.get(imp.module) ?? []
    importModules.set(imp.module, array)
    const ident = getIdent(imp.name)
    array.push({ ident, name: imp.name, type: convertExternType(imp) })
  }

  const importDeclarations = [...importModules].map(([url, parts]) => {
    const specifiers = parts.map(({ name, ident }) =>
      name === ident ? ident : `${stringifyName(name)} as ${ident}`
    )
    return `import { ${specifiers.join(", ")} } from "${url}"`
  })

  const importObject = importModules.size
    ? `{\n${
      [...importModules].map(([url, parts]) => {
        const entries = parts.map(({ name, ident, type }) =>
          `${stringifyName(name)}: ${ident} satisfies ${type}`
        )
        return `  ${JSON.stringify(url)}: { ${entries.join(", ")} }`
      }).join("\n")
    }\n}`
    : "{}"

  const exports = wasmExports.map((exp) => ({
    name: exp.name,
    ident: getIdent(exp.name),
    type: convertExternType(exp),
  }))

  const exportDeclarations = exports.map(({ name, ident, type }) =>
    (name === ident ? "export " : "")
    + `const ${ident} = /* @__PURE__ */ instance.exports${stringifyProperty(name)} as ${type}`
  )

  const exportRenames = exports.filter(({ name, ident }) => name !== ident)
  const exportStatement = exportRenames.length
    ? `export { ${
      exportRenames.map(({ name, ident }) => `${ident} as ${stringifyName(name)}`).join(", ")
    } }`
    : ""

  const src = `
import { decodeHex } from "https://deno.land/x/hexes@v0.1.0/decode.ts"
${importDeclarations.join("\n")}

const imports = ${importObject}

const wasm = /* @__PURE__ */ decodeHex(\n"${encodeHex(wasm).replace(/.{0,64}|$/g, "\\\n$&")}",\n)
const module = /* @__PURE__ */ new WebAssembly.Module(wasm)
const instance = /* @__PURE__ */ new WebAssembly.Instance(module, imports)

${exportDeclarations.join("\n")}

${exportStatement}
`.trimStart().replace(/\n\n\n+/g, "\n\n").replace(/\n*$/, "\n")

  return src

  function getIdent(name: string) {
    const base = identBase(name)
    if (!identNeedsSuffix(base)) return base
    const suffix = identSuffixes.get(base) ?? 0
    identSuffixes.set(base, suffix + 1)
    return `${base}__${suffix}`
  }

  function identNeedsSuffix(base: string) {
    return usedWords.includes(base)
      || reservedWords.includes(base)
      || identBases.indexOf(base, identBases.indexOf(base) + 1) !== -1
  }
}

function convertExternType(wasmType: WebAssembly.ExternType) {
  if (wasmType.kind === "global") {
    return "WebAssembly.Global"
  }
  if (wasmType.kind === "memory") {
    return "WebAssembly.Memory"
  }
  if (wasmType.kind === "table") {
    return "WebAssembly.Table"
  }
  if (wasmType.kind === "tag") {
    return "WebAssembly.Tag"
  }
  const params = wasmType.type.parameters.map(convertValueType)
  const results = wasmType.type.results.map(convertValueType)
  const result = results.length === 0
    ? "void"
    : results.length === 1
    ? results[0]
    : `[${results.join(", ")}]`
  return `(${params.map((type, i) => `_${i}: ${type}`).join(", ")}) => ${result}`
}

function convertValueType(wasmType: WebAssembly.ValueType) {
  switch (wasmType) {
    case "i32":
      return "number"
    case "i64":
      return "bigint"
    case "f32":
      return "number"
    case "f64":
      return "number"
    case "v128":
      return "never"
    case "funcref":
      return "Function"
    case "externref":
      return "unknown"
  }
}
