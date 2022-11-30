const top = 0;
const parent = (i) => ((i + 1) >>> 1) - 1;
const left = (i) => (i << 1) + 1;
const right = (i) => (i + 1) << 1;

export class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
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
      this._heap.push(value);
    });
    this._sort();
    return this.size();
  }
  enqueue() {
    return this._heap.shift();
  }
  upsertIfSmaller(...values) {
    values.forEach((value) => {
      const index = this._heap.findIndex((item) => item[0] === value[0]);
      if (index > -1) {
        const node = this._heap[index];
        if (value[1] < node[1]) {
          node[0] = value[0];
          node[1] = value[1];
          node[2] = value[2];
          node[3] = value[3];
        }
      } else {
        this._justPush(value);
      }
    });

    this._sort();
  }
  _sort() {
    this._heap.sort((a, b) => this._greater(a, b));
  }
  _justPush(...values) {
    this._heap.push(...values);
  }
  _greater(i, j) {
    return this._comparator(i, j) ? -1 : 1;
  }
}
