(module
  ;; Stack size: 16 pages (1 MiB)
  ;; Initial heap size: 16 pages (1 MiB)
  ;; Max heap size: 1024 pages (64 MiB)

  (import "./_memory.ts" "memory" (memory 32 1040))
  (import "./_memory.ts" "on_grow" (func $on_grow))

  (global $stack_top (mut i32) (i32.const 8))
  (export "stack_top" (global $stack_top))

  (tag $stack_overflow)
  ;; (export "stack_overflow" (tag $stack_overflow))

  (func (export "stack_push") (param $size i32) (result i32)
    (global.get $stack_top)
    (global.set $stack_top (local.tee $size (i32.add (global.get $stack_top) (call $stack_align (local.get $size)))))
    (if (i32.and (local.get $size) (i32.const 0xfff00000)) (then (throw $stack_overflow)))
  )

  (func (export "stack_pop") (param $size i32)
    (global.set $stack_top (i32.sub (global.get $stack_top) (call $stack_align (local.get $size))))
  )

  ;; Rounds `size` up to a multiple of 8, for alignment.
  (func $stack_align (param $size i32) (result i32)
    (i32.sub (i32.const 0) (i32.and (i32.sub (i32.const 0) (local.get $size)) (i32.const -8)))
  )

  ;; A WASM page is 64 KiB (0x01_00_00 bytes).
  ;;
  ;; The first 16 are reserved for the stack, so the heap starts at the address
  ;; 0x00_10_00_00.
  ;;
  ;; The heap is divided into blocks with power-of-two sizes. Free blocks of
  ;; equivalent sizes are connected an intrusive linked list.
  ;;
  ;; Since pointers are 32-bit, the smallest block size is 4 bytes. The maximum
  ;; block size (and thus the maximum allocation size) is set to 1 MiB. Thus,
  ;; there are 19 block sizes.
  ;;
  ;; The first heap page starts with the head pointers of the block linked
  ;; lists. There are 32 head pointers, indexed with the number of leading zeros
  ;; of (size - 1). Many of the initial head pointers correspond to invalid
  ;; block sizes.
  ;;
  ;; Since there are 32 entries, 32 * 4 = 128 bytes of space are needed as the
  ;; header. This means that the smallest 5 block sizes (4, 8, 16, 32, 64) have
  ;; zero blocks initially. Since the initial heap size is 1 MiB, every block
  ;; size other than the smallest 5 and the largest 1 start with exactly one
  ;; block.

  ;; The first non-zero head pointer is for 512 KiB, so:
  ;; - size = 512 KiB = 0x00_08_00_00
  ;; - index = clz(size - 1) = clz(0x00_07_ff_ff) = 13
  ;; - offset = index * 4 = 52 = 0x34
  (data (i32.const 0x00_10_00_34)
    "\00\00\18\00" ;; 512 KiB
    "\00\00\14\00" ;; 256 KiB
    "\00\00\12\00" ;; 128 KiB
    "\00\00\11\00" ;; 64 KiB
    "\00\80\10\00" ;; 32 KiB
    "\00\40\10\00" ;; 16 KiB
    "\00\20\10\00" ;; 8 KiB
    "\00\10\10\00" ;; 4 KiB
    "\00\08\10\00" ;; 2 KiB
    "\00\04\10\00" ;; 1 KiB
    "\00\02\10\00" ;; 512 B
    "\00\01\10\00" ;; 256 B
    "\80\00\10\00" ;; 128 B
    ;; implicit 0s ;; 64 B
    ;; implicit 0s ;; 32 B
    ;; implicit 0s ;; 16 B
    ;; implicit 0s ;; 8 B
    ;; implicit 0s ;; 4 B
  )

  ;; One edge case is zero-sized allocations. `alloc(0)` should return an
  ;; aligned, non-null pointer, without actually allocating anything.
  ;;
  ;; With the design of this allocator, this can actually be implemented without
  ;; a special case, by making the head pointer for a zero-sized allocation be a
  ;; circular linked list. This emulates an infinite list of zero-sized
  ;; allocations, and works naturally with the code for both alloc and free.
  ;;
  ;; Since the head pointer is located at index `clz(size - 1)`, the head
  ;; pointer for zero-sized allocations is actually at the zeroth index.
  ;;
  ;; Storing a self-referntial pointer here creates the circular linked list,
  ;; and is the only special handling needed for zero-sized allocations.
  (data (i32.const 0x00_10_00_00) "\00\00\10\00")

  (tag $heap_grow_fail)
  ;; (export "heap_grow_fail" (tag $heap_grow_fail))

  (export "heap_alloc" (func $heap_alloc))
  (func $heap_alloc (param $size i32) (result i32)
    (local $adr i32) (local $offset i32)

    (local.tee $offset (call $heap_block_offset (local.get $size)))
    (local.tee $adr (i32.load offset=0x100000 align=4)) ;; read the head pointer

    (if (then ;; if non-null:
      ;; set the head pointer to be the next pointer in the linked list
      (i32.store offset=0x100000 align=4 (local.get $offset) (i32.load align=4 (local.get $adr)))
      (return (local.get $adr))
    ))

    (if (i32.eq (local.get $offset) (i32.const 0x30)) (then ;; if this is a 1 MiB block
      ;; grow the memory by 16 pages, storing the old page count into `$adr`
      (local.tee $adr (memory.grow (i32.const 16)))
      (call $on_grow)
      (if (i32.eq (i32.const -1)) (then (throw $heap_grow_fail)))
      (return (i32.shl (local.get $adr) (i32.const 16))) ;; multiply by page size = 2^16 bytes
    ))

    ;; allocate a block of twice the size, which will be split
    (local.tee $adr (call $heap_alloc (i32.shl (local.get $size) (i32.const 1))))

    ;; set the head pointer to be the second half of the double block
    (i32.store offset=0x100000 align=4
      (local.get $offset)
      (i32.add
        (local.get $adr)
        ;; calculate the block size based on the offset
        (i32.shr_u (i32.const 0x80_00_00_00) (i32.sub (i32.shr_u (local.get $offset) (i32.const 2)) (i32.const 1)))
      )
    )

    ;; implicit return of `$adr`
  )

  (func (export "heap_free") (param $adr i32) (param $size i32)
    ;; store the head pointer at `$adr`
    (i32.store align=4
      (local.get $adr)
      ;; abuse `$size` to store the offset
      (i32.load offset=0x100000 align=4 (local.tee $size (call $heap_block_offset (local.get $size))))
    )
    ;; set the head pointer to be `$adr`
    (i32.store offset=0x100000 align=4
      (local.get $size) ;; the offset from earlier
      (local.get $adr)
    )
  )

  ;; Calculates the offset to the head pointer for the smallest block that is at least `size` bytes.
  (func $heap_block_offset (param $size i32) (result i32)
    (i32.sub (local.get $size) (i32.const 1))
    (i32.or (i32.const 3)) ;; oring with 0b11 rounds tiny allocations up to the minimum 4 bytes
    (i32.clz)
    (i32.shl (i32.const 2))
  )
)
