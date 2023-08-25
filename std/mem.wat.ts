// @generated 8fb851f8d4ee04bef3e2d01769601c16b26ba9af14877accd8f72f4668ea1228

import { decodeHex } from "https://deno.land/x/hexes@v0.1.0/decode.ts"

const imports = {}

const wasm = /* @__PURE__ */ decodeHex(
"\
0061736d0100000001120460000060017f017f60017f0060027f7f0003060501\
02010301050501012090080d0502000000000606017f0141000b074806066d65\
6d6f7279020009737461636b5f746f7003000a737461636b5f70757368000009\
737461636b5f706f7000010a686561705f616c6c6f63000209686561705f6672\
656500030ab2010519002300230020006a220024002000418080407104400800\
0b0b0900230020006b24000b6101027f20001004220228028080402201044020\
022001280200360280804020010f0b20024130460440411040002201417f4604\
4008010b20014110740f0b200041017410022201200220014180808080782002\
41027641016b766a36028080400b1b0020002001100422012802808040360200\
2001200036028080400b0e00200041016b410372674102740b0b49020041b480\
c0000b3400001800000014000000120000001100008010000040100000201000\
00101000000810000004100000021000000110008000100000418080c0000b04\
00001000\
",
)
const module = /* @__PURE__ */ new WebAssembly.Module(wasm)
const instance = /* @__PURE__ */ new WebAssembly.Instance(module, imports)

export const memory = /* @__PURE__ */ instance.exports.memory as WebAssembly.Memory
export const stack_top = /* @__PURE__ */ instance.exports.stack_top as WebAssembly.Global
export const stack_push = /* @__PURE__ */ instance.exports.stack_push as (_0: number) => number
export const stack_pop = /* @__PURE__ */ instance.exports.stack_pop as (_0: number) => void
export const heap_alloc = /* @__PURE__ */ instance.exports.heap_alloc as (_0: number) => number
export const heap_free = /* @__PURE__ */ instance.exports.heap_free as (_0: number, _1: number) => void
