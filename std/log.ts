import { encodeHex } from "https://deno.land/x/hexes@v0.1.0/encode.ts"
import { memory } from "./memory/mod.ts"

export function log_brk() {
  console.log()
}

export function log_buf(adr: number, len: number) {
  const data = new Uint8Array(memory.buffer, adr, len)
  console.log(hex_bytes(data))
}

export function log_str(adr: number, len: number) {
  const data = new Uint8Array(memory.buffer, adr, len)
  console.log(new TextDecoder().decode(data))
}

export function log_i32_u(i32: number) {
  console.log(`${hex_i32(i32)}: ${i32 >>> 0}`)
}

export function log_i32_s(i32: number) {
  console.log(`${hex_i32(i32)}: ${i32 >> 0}`)
}

export function log_f32(f32: number) {
  console.log(`${hex_f32(f32)}: ${f32}`)
}

export function log_i64_u(i64: bigint) {
  console.log(`${hex_i64(i64)}: ${i64 & 0xffff_ffff_ffff_ffffn}`)
}

export function log_i64_s(i64: bigint) {
  console.log(`${hex_i64(i64)}: ${i64}`)
}

export function log_f64(f64: number) {
  console.log(`${hex_f64(f64)}: ${f64}`)
}

export function dbg_i32_u(i32: number): number {
  log_i32_u(i32)
  return i32
}

export function dbg_i32_s(i32: number): number {
  log_i32_s(i32)
  return i32
}

export function dbg_i64_u(i64: bigint): bigint {
  log_i64_u(i64)
  return i64
}

export function dbg_i64_s(i64: bigint): bigint {
  log_i64_s(i64)
  return i64
}

function hex_i32(n: number) {
  return hex_bytes(new Uint32Array([n]))
}

function hex_i64(n: bigint) {
  return hex_bytes(new BigUint64Array([n]))
}

function hex_f32(n: number) {
  return hex_bytes(new Float32Array([n]))
}

function hex_f64(n: number) {
  return hex_bytes(new Float64Array([n]))
}

function hex_bytes(arr: { buffer: ArrayBuffer; byteOffset: number; byteLength: number }) {
  const u8a = new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength)
  return encodeHex(u8a).replace(/(..)/g, "\\$1")
}
