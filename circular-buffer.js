//
// This is only a SKELETON file for the 'Circular Buffer' exercise. It's been provided as a
// convenience to get you started writing code faster.
//

class CircularBuffer {
  #arr
  #buffer_size
  #length
  #tail
  #head
  #next

  constructor(size) {
    this.#buffer_size = size
    this.#arr = new Array(size)
    this.#length = 0
    this.#tail = 0
    this.#head = 0
    this.#next = 0
  }

  write(value) {
    // TODO: handle 0 and 1 sizes

    if (this.#length === this.#buffer_size) {
      /// full
      throw new BufferFullError()
    }

    /// set value
    this.#arr[this.#next] = value

    /// increase cursors
    this.#length = this.#length + 1
    this.#head = this.#next
    this.#next = (this.#next + 1) % this.#buffer_size
  }

  read() {
    if (this.#length === 0) {
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
      /// full, increase tail as well
      this.#tail = (this.#tail + 1) % this.#buffer_size
    }
    this.#head = this.#next
    this.#next = (this.#next + 1) % this.#buffer_size
  }

  clear() {
    if (this.#length === 0) {
      /// empty, no more to clear
      throw new BufferEmptyError()
    }

    this.#arr[this.#tail] = undefined

    this.#length = this.#length - 1
    this.#tail = (this.#tail + 1) % this.#buffer_size
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
