//
// This is only a SKELETON file for the 'Circular Buffer' exercise. It's been provided as a
// convenience to get you started writing code faster.
//

class CircularBuffer {
  #arr
  #size
  #tail
  #head
  #next

  constructor(size) {
    this.#size = size
    this.#arr = new Array(size)
    this.#tail = 0
    this.#head = 0
    this.#next = 0
  }

  write(value) {
    // TODO: handle 0 and 1 sizes

    if (this.#next === this.#tail && this.#next !== this.#head) {
      /// full and not first write
      throw new BufferFullError()
    }

    /// set value
    this.#arr[this.#next] = value

    /// increase cursors
    this.#head = this.#next
    this.#next = (this.#next + 1) % this.#size
  }

  read() {
    if (this.#arr[this.#tail] === undefined) {
      /// empty
      throw new BufferEmptyError()
    }
    return this.#arr[this.#tail]
  }

  forceWrite(value) {
    /// set value
    this.#arr[this.#next] = value

    /// increase cursors
    if (this.#next === this.#tail) {
      this.#tail = (this.#tail + 1) % this.#size
    }
    this.#head = this.#next
    this.#next = (this.#next + 1) % this.#size
  }

  clear() {
    if (this.#head === this.#tail) {
      /// empty, no more to clear
      throw new BufferEmptyError()
    }

    this.#arr[this.#tail] = undefined
    this.#tail = (this.#tail + 1) % this.#size
  }
}

export default CircularBuffer

export class BufferFullError extends Error {
  constructor() {
    super('Buffer is full')
    this.name = 'BufferFullError'
  }
}

export class BufferEmptyError extends Error {
  constructor() {
    super('Buffer is empty')
    this.name = 'BufferEmptyError'
  }
}
