import { memoryU8A } from "./_memory.ts"
import { heap_alloc, heap_free, stack_pop, stack_push } from "./memory.wat.ts"

const zero_adr = heap_alloc(0)

interface TypedArray {
  buffer: ArrayBuffer
  byteOffset: number
  byteLength: number
}

interface TypedArrayConstructor<T extends TypedArray> {
  new(buffer: ArrayBuffer): T
}

export class WasmBuffer {
  constructor(public adr: number, public len: number) {}

  get u8a() {
    return memoryU8A.subarray(this.adr, this.end)
  }

  get end() {
    return this.adr + this.len
  }

  subarray(start: number, end = this.len) {
    return new WasmBuffer(this.adr + start, end - start)
  }

  copy(buf: WasmBuffer, offset = 0) {
    memoryU8A.copyWithin(this.adr + offset, buf.adr, buf.end)
    return this
  }

  write(typedArray: TypedArray, offset = 0) {
    memoryU8A.set(toUint8Array(typedArray), this.adr + offset)
    return this
  }

  readInto(typedArray: TypedArray) {
    toUint8Array(typedArray).set(memoryU8A.subarray(this.adr, this.end))
    return this
  }

  read(): Uint8Array
  read<T extends TypedArray>(TypedArray?: TypedArrayConstructor<T>): T
  read(TypedArray: TypedArrayConstructor<TypedArray> = Uint8Array): TypedArray {
    const typedArray = new TypedArray(new ArrayBuffer(this.len))
    this.readInto(typedArray)
    return typedArray
  }

  fill(byte: number, start = 0, end = this.len) {
    memoryU8A.fill(byte, this.adr + start, this.adr + end)
    return this
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

function toUint8Array(typedArray: TypedArray) {
  return typedArray instanceof Uint8Array
    ? typedArray
    : new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength)
}
