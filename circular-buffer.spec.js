import CircularBuffer, {
  BufferFullError,
  BufferEmptyError,
  BufferConstructorError,
} from './circular-buffer'

describe('CircularBuffer', () => {
  const writeRange = (buffer, values) => {
    values.forEach((value) => buffer.write(value))
  }

  const expectRange = (buffer, expectValues) => {
    expectValues.forEach((value) => {
      expect(buffer.read()).toBe(value)
      buffer.clear()
    })
  }

  test('reading empty buffer should fail', () => {
    const buffer = new CircularBuffer(1)
    expect(() => buffer.read()).toThrow(BufferEmptyError)
  })

  test('clearing empty buffer should fail', () => {
    const buffer = new CircularBuffer(1)
    expect(() => buffer.clear()).toThrow(BufferEmptyError)
  })

  test('can read an item just written', () => {
    const buffer = new CircularBuffer(1)
    buffer.write('1')
    expect(buffer.read()).toBe('1')
  })

  test('zero sized buffer read fails', () => {
    const buffer = new CircularBuffer(0)
    expect(() => buffer.read()).toThrow(BufferEmptyError)
  })

  test('zero sized buffer write fails', () => {
    const buffer = new CircularBuffer(0)
    expect(() => buffer.write('1')).toThrow(BufferFullError)
  })

  test('zero sized buffer force write fails', () => {
    const buffer = new CircularBuffer(0)
    expect(() => buffer.forceWrite('1')).toThrow(BufferFullError)
  })

  test('size cannot be smaller than zero', () => {
    expect(() => new CircularBuffer(-1)).toThrow(BufferConstructorError)
  })

  test('writing to full buffer should fail', () => {
    const buffer = new CircularBuffer(5)
    writeRange(buffer, ['1', '2', '3', '4', '5'])
    expect(() => buffer.write('6')).toThrow(BufferFullError)
  })

  test('force writing to full buffer works', () => {
    const buffer = new CircularBuffer(5)
    writeRange(buffer, ['1', '2', '3', '4', '5'])
    buffer.forceWrite('6')
    expectRange(buffer, ['2', '3', '4', '5', '6'])
  })

  test('clearing all elements work, and afterwards empty error is thrown when reading', () => {
    const buffer = new CircularBuffer(3)
    writeRange(buffer, ['1', '2', '3'])
    buffer.forceWrite('4')
    buffer.forceWrite('5')

    expectRange(buffer, ['3', '4', '5'])
    expect(() => buffer.read()).toThrow(BufferEmptyError)
  })

  test('complex writes work correctly', () => {
    const buffer = new CircularBuffer(3)

    writeRange(buffer, ['1', '2', '3'])
    expect(buffer.read()).toBe('1')

    buffer.forceWrite('4') // 4, *2, 3
    expect(buffer.read()).toBe('2')

    buffer.forceWrite('5') // 4, 5, *3
    expect(buffer.read()).toBe('3')

    buffer.clear() // *4, 5, _
    expect(buffer.read()).toBe('4')

    buffer.forceWrite('6') // *4, 5, 6
    expect(buffer.read()).toBe('4')

    expectRange(buffer, ['4', '5', '6'])
    expect(() => buffer.read()).toThrow(BufferEmptyError)
  })

  test('force writes only', () => {
    const buffer = new CircularBuffer(2)
    buffer.forceWrite('1')
    expect(buffer.read()).toBe('1')
    buffer.forceWrite('2')
    expect(buffer.read()).toBe('1')
    buffer.forceWrite('3')
    expect(buffer.read()).toBe('2')
  })

  test('non-string elements work', () => {
    const buffer = new CircularBuffer(1)
    buffer.write(1)
    expect(buffer.read()).toBe(1)
    buffer.clear()

    buffer.write({
      test_1: 1,
      test_2: 2,
    })
    expect(buffer.read()).toEqual({
      test_1: 1,
      test_2: 2,
    })
    buffer.clear()

    buffer.write(true)
    expect(buffer.read()).toBe(true)
    buffer.clear()
  })
})
