import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines } from "../helper/fileLoader.js";
import { printMatrix } from "../helper/matrix.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const left = [-1, 1];
const right = [1, 1];
const down = [0, 1];

const lines = loadByLines(join(currentDir, "input.txt")).filter(Boolean);
(function run() {
  const points = lines.map((line) =>
    line
      .split("->")
      .map((i) => i.trim())
      .map((i) => i.split(",").map((a) => +a))
  );
  const xs = points.map((line) => line.map((l) => l[0])).flat(2);
  const ys = points.map((line) => line.map((l) => l[1])).flat(2);
  const ls = points.map((line) => {
    const points = [];
    for (let p = 1; p < line.length; p++) {
      const p1 = line[p];
      const p0 = line[p - 1];

      let maxX = Math.max(p1[0], p0[0]);
      let minX = Math.min(p1[0], p0[0]);
      let maxY = Math.max(p1[1], p0[1]);
      let minY = Math.min(p1[1], p0[1]);

      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          points.push([x, y]);
        }
      }
    }
    return points;
  });

  const pls = ls.flat(1);

  let minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  let matrix = [];
  for (let y = 0; y <= maxY; y++) {
    if (!matrix[y]) {
      matrix[y] = [];
    }
    for (let x = 0; x <= maxX - minX; x++) {
      matrix[y][x] = ".";
    }
  }

  pls.forEach((p) => {
    matrix[p[1]][p[0] - minX] = "#";
  });

  const additionalSpace = Math.floor(maxY);
  const arr = new Array(additionalSpace).fill(".");
  const bottom = new Array(2).fill(
    new Array(matrix[0].length + 2 * additionalSpace).fill(".")
  );

  matrix = matrix.map((l) => [...arr, ...l, ...arr]);
  matrix = [...matrix, ...bottom];

  matrix[matrix.length - 1] = matrix[matrix.length - 1].map(() => "#");
  minX = minX - additionalSpace;
  printMatrix(matrix);

  let final = false;
  let sands = 0;
  while (!final) {
    let done = false;
    sands++;
    let sand = [500, 0];
    let steps = -1;
    while (!done) {
      steps++;
      const m1 = [sand[0] + down[0], sand[1] + down[1]];
      const m2 = [sand[0] + left[0], sand[1] + left[1]];
      const m3 = [sand[0] + right[0], sand[1] + right[1]];

      const b = matrix[m1[1]][m1[0] - minX] !== ".";
      const l = matrix[m2[1]][m2[0] - minX] !== ".";
      const r = matrix[m3[1]][m3[0] - minX] !== ".";

      if (steps === 0 && b && l && r) {
        final = true;
        break;
      }
      if (b && l && r) {
        done = true;
        continue;
      }

      if (b && l) {
        sand = m3;
        continue;
      }

      if (b) {
        sand = m2;
        continue;
      }

      sand = m1;
    }
    matrix[sand[1]][sand[0] - minX] = "0";
  }

  console.log(sands);
})();
