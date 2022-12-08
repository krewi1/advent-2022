import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines } from "../helper/fileLoader.js";
import { transpose } from "../helper/matrix.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const lines = loadByLines(join(currentDir, "input.txt")).filter(Boolean);
(function run() {
  const grid = lines.map((line) => [...line].map((ch) => +ch));
  const columGrid = transpose(grid);
  const width = grid[0].length;
  const height = grid.length;
  const scores = [];
  for (let row = 1; row < height - 1; row++) {
    const r = grid[row];
    for (let col = 1; col < width - 1; col++) {
      const c = columGrid[col];
      const n = r[col];

      const bR = [...r].splice(0, col);
      const aR = [...r].splice(col + 1, width);
      const bC = [...c].splice(0, row);
      const aC = [...c].splice(row + 1, height);

      const p = viewP.bind(null, n);
      const m = viewM.bind(null, n);
      const left = m(bR);
      const right = p(aR);
      const top = m(bC);
      const bottom = p(aC);

      scores.push(left * right * top * bottom);
    }
  }
  console.log(Math.max(...scores));
})();

function viewP(n, arr) {
  const l = arr.length;
  for (let i = 0; i < l; i++) {
    const e = arr[i];
    if (n <= e) {
      return i + 1;
    }
  }
  return l;
}

function viewM(n, arr) {
  const l = arr.length;
  for (let i = l - 1; i >= 0; i--) {
    const e = arr[i];
    if (n <= e) {
      return l - i;
    }
  }
  return l;
}
