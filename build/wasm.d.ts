/** @category WebAssembly */
export declare namespace WebAssembly {
  /**
   * The `WebAssembly.CompileError` object indicates an error during WebAssembly decoding or validation.
   *
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/CompileError)
   *
   * @category WebAssembly
   */
  export class CompileError extends Error {
    /** Creates a new `WebAssembly.CompileError` object. */
    constructor(message?: string, options?: ErrorOptions)
  }

  /**
   * A `WebAssembly.Global` object represents a global variable instance, accessible from
   * both JavaScript and importable/exportable across one or more `WebAssembly.Module`
   * instances. This allows dynamic linking of multiple modules.
   *
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Global)
   *
   * @category WebAssembly
   */
  export class Global {
    /** Creates a new `Global` object. */
    constructor(descriptor: GlobalDescriptor, v?: any)

    /**
     * The value contained inside the global variable — this can be used to directly set
     * and get the global's value.
     */
    value: any

    /** Old-style method that returns the value contained inside the global variable. */
    valueOf(): any
  }

  /**
   * A `WebAssembly.Instance` object is a stateful, executable instance of a `WebAssembly.Module`.
   * Instance objects contain all the Exported WebAssembly functions that allow calling into
   * WebAssembly code from JavaScript.
   *
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)
   *
   * @category WebAssembly
   */
  export class Instance {
    /** Creates a new Instance object. */
    constructor(module: Module, importObject?: Imports)

    /**
     * Returns an object containing as its members all the functions exported from the
     * WebAssembly module instance, to allow them to be accessed and used by JavaScript.
     * Read-only.
     */
    readonly exports: Exports
  }

  /**
   * The `WebAssembly.LinkError` object indicates an error during module instantiation
   * (besides traps from the start function).
   *
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/LinkError)
   *
   * @category WebAssembly
   */
  export class LinkError extends Error {
    /** Creates a new WebAssembly.LinkError object. */
    constructor(message?: string, options?: ErrorOptions)
  }

  /**
   * The `WebAssembly.Memory` object is a resizable `ArrayBuffer` or `SharedArrayBuffer` that
   * holds the raw bytes of memory accessed by a WebAssembly Instance.
   *
   * A memory created by JavaScript or in WebAssembly code will be accessible and mutable
   * from both JavaScript and WebAssembly.
   *
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory)
   *
   * @category WebAssembly
   */
  export class Memory {
    /** Creates a new `Memory` object. */
    constructor(descriptor: MemoryDescriptor)

    /** An accessor property that returns the buffer contained in the memory. */
    readonly buffer: ArrayBuffer | SharedArrayBuffer

    /**
     * Increases the size of the memory instance by a specified number of WebAssembly
     * pages (each one is 64KB in size).
     */
    grow(delta: number): number
  }

  /**
   * A `WebAssembly.Module` object contains stateless WebAssembly code that has already been compiled
   * by the browser — this can be efficiently shared with Workers, and instantiated multiple times.
   *
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module)
   *
   * @category WebAssembly
   */
  export class Module {
    /** Creates a new `Module` object. */
    constructor(bytes: BufferSource)

    /**
     * Given a `Module` and string, returns a copy of the contents of all custom sections in the
     * module with the given string name.
     */
    static customSections(
      moduleObject: Module,
      sectionName: string,
    ): ArrayBuffer[]

    /** Given a `Module`, returns an array containing descriptions of all the declared exports. */
    static exports(moduleObject: Module): ModuleExportDescriptor[]

    /** Given a `Module`, returns an array containing descriptions of all the declared imports. */
    static imports(moduleObject: Module): ModuleImportDescriptor[]
  }

  /**
   * The `WebAssembly.RuntimeError` object is the error type that is thrown whenever WebAssembly
   * specifies a trap.
   *
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/RuntimeError)
   *
   * @category WebAssembly
   */
  export class RuntimeError extends Error {
    /** Creates a new `WebAssembly.RuntimeError` object. */
    constructor(message?: string, options?: ErrorOptions)
  }

  /**
   * The `WebAssembly.Table()` object is a JavaScript wrapper object — an array-like structure
   * representing a WebAssembly Table, which stores function references. A table created by
   * JavaScript or in WebAssembly code will be accessible and mutable from both JavaScript
   * and WebAssembly.
   *
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Table)
   *
   * @category WebAssembly
   */
  export class Table {
    /** Creates a new `Table` object. */
    constructor(descriptor: TableDescriptor)

    /** Returns the length of the table, i.e. the number of elements. */
    readonly length: number

    /** Accessor function — gets the element stored at a given index. */
    get(index: number): Function | null

    /** Increases the size of the `Table` instance by a specified number of elements. */
    grow(delta: number): number

    /** Sets an element stored at a given index to a given value. */
    set(index: number, value: Function | null): void
  }

  /** The `GlobalDescriptor` describes the options you can pass to
   * `new WebAssembly.Global()`.
   *
   * @category WebAssembly
   */
  export interface GlobalDescriptor {
    mutable?: boolean
    value: ValueType
  }

  /** The `MemoryDescriptor` describes the options you can pass to
   * `new WebAssembly.Memory()`.
   *
   * @category WebAssembly
   */
  export interface MemoryDescriptor {
    initial: number
    maximum?: number
    shared?: boolean
  }

  /** A `ModuleExportDescriptor` is the description of a declared export in a
   * `WebAssembly.Module`.
   *
   * @category WebAssembly
   */
  export type ModuleExportDescriptor = ExternType & {
    name: string
  }

  /** A `ModuleImportDescriptor` is the description of a declared import in a
   * `WebAssembly.Module`.
   *
   * @category WebAssembly
   */
  export type ModuleImportDescriptor = ExternType & {
    module: string
    name: string
  }

  /** The `TableDescriptor` describes the options you can pass to
   * `new WebAssembly.Table()`.
   *
   * @category WebAssembly
   */
  export interface TableDescriptor {
    element: TableKind
    initial: number
    maximum?: number
  }

  /** The value returned from `WebAssembly.instantiate`.
   *
   * @category WebAssembly
   */
  export interface WebAssemblyInstantiatedSource {
    /* A `WebAssembly.Instance` object that contains all the exported WebAssembly functions. */
    instance: Instance

    /**
     * A `WebAssembly.Module` object representing the compiled WebAssembly module.
     * This `Module` can be instantiated again, or shared via postMessage().
     */
    module: Module
  }

  /** @category WebAssembly */
  export type ImportExportKind = "function" | "global" | "memory" | "table"
  /** @category WebAssembly */
  export type TableKind = "anyfunc"
  /** @category WebAssembly */
  export type ExportValue = Function | Global | Memory | Table
  /** @category WebAssembly */
  export type Exports = Record<string, ExportValue>
  /** @category WebAssembly */
  export type ImportValue = ExportValue | number
  /** @category WebAssembly */
  export type ModuleImports = Record<string, ImportValue>
  /** @category WebAssembly */
  export type Imports = Record<string, ModuleImports>

  export type RefType = "funcref" | "externref"
  export type ValueType = "i32" | "i64" | "f32" | "f64" | "v128" | RefType
  export type GlobalType = { value: ValueType; mutable: boolean }
  export type MemoryType = { limits: Limits }
  export type TableType = { limits: Limits; element: RefType }
  export type Limits = { min: number; max?: number } // see below
  export type FunctionType = { parameters: ValueType[]; results: ValueType[] }
  export type ExternType =
    | { kind: "function"; type: FunctionType }
    | { kind: "memory"; type: MemoryType }
    | { kind: "table"; type: TableType }
    | { kind: "global"; type: GlobalType }
    | { kind: "tag" }

  /**
   * The `WebAssembly.compile()` function compiles WebAssembly binary code into a
   * `WebAssembly.Module` object. This function is useful if it is necessary to compile
   * a module before it can be instantiated (otherwise, the `WebAssembly.instantiate()`
   * function should be used).
   *
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/compile)
   *
   * @category WebAssembly
   */
  export function compile(bytes: BufferSource): Promise<Module>

  /**
   * The `WebAssembly.compileStreaming()` function compiles a `WebAssembly.Module`
   * directly from a streamed underlying source. This function is useful if it is
   * necessary to a compile a module before it can be instantiated (otherwise, the
   * `WebAssembly.instantiateStreaming()` function should be used).
   *
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/compileStreaming)
   *
   * @category WebAssembly
   */
  export function compileStreaming(
    source: Response | Promise<Response>,
  ): Promise<Module>

  /**
   * The WebAssembly.instantiate() function allows you to compile and instantiate
   * WebAssembly code.
   *
   * This overload takes the WebAssembly binary code, in the form of a typed
   * array or ArrayBuffer, and performs both compilation and instantiation in one step.
   * The returned Promise resolves to both a compiled WebAssembly.Module and its first
   * WebAssembly.Instance.
   *
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate)
   *
   * @category WebAssembly
   */
  export function instantiate(
    bytes: BufferSource,
    importObject?: Imports,
  ): Promise<WebAssemblyInstantiatedSource>

  /**
   * The WebAssembly.instantiate() function allows you to compile and instantiate
   * WebAssembly code.
   *
   * This overload takes an already-compiled WebAssembly.Module and returns
   * a Promise that resolves to an Instance of that Module. This overload is useful
   * if the Module has already been compiled.
   *
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate)
   *
   * @category WebAssembly
   */
  export function instantiate(
    moduleObject: Module,
    importObject?: Imports,
  ): Promise<Instance>

  /**
   * The `WebAssembly.instantiateStreaming()` function compiles and instantiates a
   * WebAssembly module directly from a streamed underlying source. This is the most
   * efficient, optimized way to load wasm code.
   *
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming)
   *
   * @category WebAssembly
   */
  export function instantiateStreaming(
    response: Response | PromiseLike<Response>,
    importObject?: Imports,
  ): Promise<WebAssemblyInstantiatedSource>

  /**
   * The `WebAssembly.validate()` function validates a given typed array of
   * WebAssembly binary code, returning whether the bytes form a valid wasm
   * module (`true`) or not (`false`).
   *
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/validate)
   *
   * @category WebAssembly
   */
  export function validate(bytes: BufferSource): boolean
}
