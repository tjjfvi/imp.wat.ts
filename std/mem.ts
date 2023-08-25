import { heap_alloc, heap_free, memory, stack_pop, stack_push } from "./mem.wat.ts"

const zero_adr = heap_alloc(0)

export class WasmBuffer {
  constructor(public adr: number, public len: number) {}

  get u8a() {
    return new Uint8Array(memory.buffer, this.adr, this.len)
  }
}

export class HeapBuffer extends WasmBuffer {
  constructor(len: number) {
    super(heap_alloc(len), len)
  }

  dispose() {
    heap_free(this.adr, this.len)
    this.adr = zero_adr
    this.len = 0
  }
}

export class StackBuffer extends WasmBuffer {
  constructor(len: number) {
    super(stack_push(len), len)
  }

  dispose() {
    stack_pop(this.len)
    this.adr = 0
    this.len = 0
  }
}
