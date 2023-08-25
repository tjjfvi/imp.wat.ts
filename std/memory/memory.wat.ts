// @generated fd286811bf9390000fff3ca17f4cee2bb1c06afbc894c3ecb99eec0840d546f3

import { decodeHex } from "https://deno.land/x/hexes@v0.1.0/decode.ts"
import { memory, on_grow } from "./_memory.ts"

const imports = {
  "./_memory.ts": { memory: memory satisfies WebAssembly.Memory, on_grow: on_grow satisfies () => void },
}

const wasm = /* @__PURE__ */ decodeHex(
"\
0061736d0100000001120460000060017f017f60017f0060027f7f000231020c\
2e2f5f6d656d6f72792e7473066d656d6f727902012090080c2e2f5f6d656d6f\
72792e7473076f6e5f67726f77000003060501020103010d0502000000000606\
017f0141000b073f0509737461636b5f746f7003000a737461636b5f70757368\
000109737461636b5f706f7000020a686561705f616c6c6f6300030968656170\
5f6672656500040ab4010519002300230020006a220024002000418080407104\
4008000b0b0900230020006b24000b6301027f20001005220228028080402201\
044020022001280200360280804020010f0b2002413046044041104000220110\
00417f46044008010b20014110740f0b20004101741003220120022001418080\
808078200241027641016b766a36028080400b1b002000200110052201280280\
80403602002001200036028080400b0e00200041016b410372674102740b0b49\
020041b480c0000b340000180000001400000012000000110000801000004010\
0000201000001010000008100000041000000210000001100080001000004180\
80c0000b0400001000\
",
)
const module = /* @__PURE__ */ new WebAssembly.Module(wasm)
const instance = /* @__PURE__ */ new WebAssembly.Instance(module, imports)

export const stack_top = /* @__PURE__ */ instance.exports.stack_top as WebAssembly.Global
export const stack_push = /* @__PURE__ */ instance.exports.stack_push as (_0: number) => number
export const stack_pop = /* @__PURE__ */ instance.exports.stack_pop as (_0: number) => void
export const heap_alloc = /* @__PURE__ */ instance.exports.heap_alloc as (_0: number) => number
export const heap_free = /* @__PURE__ */ instance.exports.heap_free as (_0: number, _1: number) => void
