// @generated 23dc9914d6925c45ea1853c76f795cec04d2ba4df2cb2815e185bea1eff293ca

import { decodeHex } from "https://deno.land/x/hexes@v0.1.0/decode.ts"
import { memory, on_grow } from "./_memory.ts"

const imports = {
  "./_memory.ts": { memory: memory satisfies WebAssembly.Memory, on_grow: on_grow satisfies () => void },
}

const wasm = /* @__PURE__ */ decodeHex(
"\
0061736d0100000001120460000060017f017f60017f0060027f7f000231020c\
2e2f5f6d656d6f72792e7473066d656d6f727902012090080c2e2f5f6d656d6f\
72792e7473076f6e5f67726f7700000307060102010103010d05020000000006\
06017f0141080b073f0509737461636b5f746f7003000a737461636b5f707573\
68000109737461636b5f706f7000020a686561705f616c6c6f63000409686561\
705f6672656500050ac601061b0023002300200010036a220024002000418080\
4071044008000b0b0b002300200010036b24000b0d004100410020006b417871\
6b0b6301027f2000100622022802808040220104402002200128020036028080\
4020010f0b200241304604404110400022011000417f46044008010b20014110\
740f0b20004101741004220120022001418080808078200241027641016b766a\
36028080400b1b00200020011006220128028080403602002001200036028080\
400b0e00200041016b410372674102740b0b49020041b480c0000b3400001800\
0000140000001200000011000080100000401000002010000010100000081000\
0004100000021000000110008000100000418080c0000b0400001000\
",
)
const module = /* @__PURE__ */ new WebAssembly.Module(wasm)
const instance = /* @__PURE__ */ new WebAssembly.Instance(module, imports)

export const stack_top = /* @__PURE__ */ instance.exports.stack_top as WebAssembly.Global
export const stack_push = /* @__PURE__ */ instance.exports.stack_push as (_0: number) => number
export const stack_pop = /* @__PURE__ */ instance.exports.stack_pop as (_0: number) => void
export const heap_alloc = /* @__PURE__ */ instance.exports.heap_alloc as (_0: number) => number
export const heap_free = /* @__PURE__ */ instance.exports.heap_free as (_0: number, _1: number) => void
