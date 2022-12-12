const top = 0;

export class PriorityQueue {
  constructor() {
    this._heap = [];
    this._items = new Map();
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[top];
  }
  push(...values) {
    values.forEach((value) => {
      const key = `${value.position[0]}:${value.position[1]}`;
      if (!this._items.has(key)) {
        this._items.set(key, value);
        this._heap.push(value);
      } else {
        const item = this._items.get(key);
        if (item.length > value.length) {
          this._items.set(key, value);
          this._remove(item);
          this._heap.push(value);
        }
      }
    });
    this._sort();
  }
  enqueue() {
    return this._heap.shift();
  }
  _remove(value) {
    this._heap.splice(this._heap.indexOf(value), 1);
  }
  _sort() {
    this._heap.sort((a, b) => a.length < b.length);
  }
}
