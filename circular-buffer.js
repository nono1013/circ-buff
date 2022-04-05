//
// This is only a SKELETON file for the 'Circular Buffer' exercise. It's been provided as a
// convenience to get you started writing code faster.
//

class CircularBuffer {
  /// array of values
  #arr
  /// max size of buffer
  #buffer_size
  /// current length filled with values
  #length
  /// cursor pointing to last element
  #tail
  /// cursor pointing to current element
  #head

  constructor(size) {
    this.#buffer_size = size
    this.#arr = new Array(size)
    this.#length = 0
    this.#tail = 0
    this.#head = 0
  }

  #get(index) {
    return this.#arr[index]
  }

  #set(index, value) {
    this.#arr[index] = value
  }

  #empty() {
    return this.#length === 0
  }

  #full() {
    return this.#length === this.#buffer_size
  }

  write(value) {
    if (this.#full()) {
      throw new BufferFullError()
    }

    const next = (this.#head + 1) % this.#buffer_size

    this.#set(next, value)

    /// increase cursors
    if (!this.#empty()) {
      /// adding to empty does not move head
      this.#head = next
    }
    this.#length = this.#length + 1
  }

  read() {
    if (this.#empty()) {
      throw new BufferEmptyError()
    }
    return this.#get(this.#tail)
  }

  forceWrite(value) {
    const next = (this.#head + 1) % this.#buffer_size

    this.#set(next, value)

    /// increase cursors
    if (!this.#empty()) {
      /// adding to empty does not move head
      this.#head = next
    }
    if (this.#full()) {
      /// full, increase tail but not length
      this.#tail = (this.#tail + 1) % this.#buffer_size
    } else {
      this.#length = this.#length + 1
    }
  }

  clear() {
    if (this.#empty()) {
      throw new BufferEmptyError()
    }

    this.#set(this.#tail, undefined)

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
