import CircularBuffer, {
  BufferFullError,
  BufferEmptyError,
} from './circular-buffer'

describe('CircularBuffer', () => {
  test('reading empty buffer should fail', () => {
    const buffer = new CircularBuffer(1)
    expect(() => buffer.read()).toThrow(BufferEmptyError)
  })

  test('can read an item just written', () => {
    const buffer = new CircularBuffer(1)
    buffer.write('1')
    expect(buffer.read()).toBe('1')
  })

  test('can read items', () => {
    const buffer = new CircularBuffer(5)
    buffer.write('1')
    buffer.write('2')
    buffer.write('3')
    expect(buffer.read()).toBe('1')
    buffer.clear()
    expect(buffer.read()).toBe('2')
    buffer.write('4')
    buffer.write('5')
    buffer.write('6')
    expect(() => buffer.write('7')).toThrow(BufferFullError)
  })
})
