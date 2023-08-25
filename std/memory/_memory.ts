export const memory = new WebAssembly.Memory({
  initial: 32,
  maximum: 1040,
})

export let memoryU8A = new Uint8Array(memory.buffer)

export function on_grow() {
  memoryU8A = new Uint8Array(memory.buffer)
}
