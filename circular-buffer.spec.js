import CircularBuffer, {
  BufferFullError,
  BufferEmptyError,
} from './circular-buffer'

describe('CircularBuffer', () => {
  const writeRange = (buffer, values) => {
    values.forEach((value) => buffer.write(value))
  }

  const expectRange = (buffer, expectValues) => {
    expectValues.forEach((value, index) => {
      expect(buffer.read()).toBe(value)
      buffer.clear()
    })
  }

  test('reading empty buffer should fail', () => {
    const buffer = new CircularBuffer(1)
    expect(() => buffer.read()).toThrow(BufferEmptyError)
  })

  test('can read an item just written', () => {
    const buffer = new CircularBuffer(1)
    buffer.write('1')
    expect(buffer.read()).toBe('1')
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

  // TODO: test 0 and 1 sizes
  // TODO: test length and cursor increase
})
