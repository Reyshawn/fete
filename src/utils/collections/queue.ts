
export default class Queue<T> {
  private _size: number = 0

  private isFixedSize = false
  private values: T[] = []

  constructor(size: number | undefined) {
    if (size != null) {
      this._size = size
      this.isFixedSize = true
    }
  }

  enqueue(val: T) {
    this.values.push(val)

    if (this.isFixedSize && this.values.length > this._size) {
      this.dequeue()
    }
  }

  dequeue(): T | undefined {
    return this.values.shift()
  }

  get size(): number {
    if (this.isFixedSize) {
      return this._size!
    }

    return this.values.length
  }

  get latest(): T | undefined {
    return this.values[this.values.length - 1]
  }

  get earliest(): T | undefined {
    return this.values[0]
  }
}
