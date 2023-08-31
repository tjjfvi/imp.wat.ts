// @generated 80b280274060cf44aaf249380243be57a701170912a63360aa81ac0c5b4e5e9d

import { memory, on_grow } from "./_memory.ts"

import { decodeHex } from "https://deno.land/x/hexes@v0.1.0/decode.ts"

type Imports = {
  "./_memory.ts": {
    memory: WebAssembly.Memory
    on_grow: () => void
  }
}

type Exports = {
  stack_top: WebAssembly.Global
  stack_push: (_0: number) => number
  stack_pop: (_0: number) => void
  heap_alloc: (_0: number) => number
  heap_free: (_0: number, _1: number) => void
}

const sourceHex = "\
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
"
let module: WebAssembly.Module

const imports: Imports = {
  "./_memory.ts": {
    memory,
    on_grow,
  },
}
const exports = /* @__PURE__ */ instantiate(imports)

export const stack_top = /* @__PURE__ */ exports.stack_top
export const stack_push = /* @__PURE__ */ exports.stack_push
export const stack_pop = /* @__PURE__ */ exports.stack_pop
export const heap_alloc = /* @__PURE__ */ exports.heap_alloc
export const heap_free = /* @__PURE__ */ exports.heap_free

function instantiate(imports: Imports): Exports {
  module ??= new WebAssembly.Module(decodeHex(sourceHex))
  const instance = new WebAssembly.Instance(module, imports)
  const exports = instance.exports as Exports

  return exports
}
