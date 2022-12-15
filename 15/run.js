import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines } from "../helper/fileLoader.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const lines = loadByLines(join(currentDir, "input.txt")).filter(Boolean);

const maxR = 4000000;
(function run() {
  const data = lines.map((line) => {
    const [, , x, y, , , , , bx, by] = line.split(" ");
    return [
      x.split("=").at(-1).replace(",", ""),
      y.split("=").at(-1).replace(":", ""),
      bx.split("=").at(-1).replace(",", ""),
      by.split("=").at(-1).replace(",", ""),
    ].map((i) => +i);
  });

  const bys = data.map((d) => d[3]);
  const bxs = data.map((d) => d[2]);
  const may = Math.max(...bys);
  const miy = Math.min(...bys);
  const max = Math.max(...bxs);
  const mix = Math.min(...bxs);

  function calculateVectorSize(x, y, bx, by) {
    const maxX = Math.max(x, bx);
    const minX = Math.min(x, bx);
    const maxY = Math.max(y, by);
    const minY = Math.min(y, by);
    const vector = [maxX - minX, maxY - minY];
    return vector[0] + vector[1];
  }

  const checkers = data.map(([x, y, bx, by]) => {
    const vectorSize = calculateVectorSize(x, y, bx, by);

    return (yp) => {
      const relativeY = Math.abs(y - yp);
      const xadd = vectorSize - relativeY;
      if (xadd < 0) {
        return;
      }
      const left = x - xadd;
      const right = x + xadd;
      return [left, right];
    };
  });

  const results = [];

  function consolidate(arr) {
    const r = [...r];
    const consolidated = [];
    while (r.length) {
      const cr = r.shift();
      if (cr === r[0] || cr + 1 === r[0]) {
        r.shift();
        continue;
      }
      consolidated.push(cr);
      counter++;
    }
    return consolidated;
  }
  for (let y = 0; y <= maxR; y++) {
    const sets = checkers.map((check) => check(y)).filter(Boolean);
    const r = sets.reduce((acc, [x1, x2]) => {
      const x1Norm = Math.max(0, x1);
      const x2Norm = Math.min(maxR, x2);
      if (!acc.length) {
        return [x1Norm, x2Norm];
      }

      let clonedArr = [...acc];
      clonedArr.push(x1Norm, x2Norm);
      clonedArr = clonedArr.sort((a, b) => (a < b ? -1 : 1));

      const ix1 = clonedArr.lastIndexOf(x1Norm);
      const ix2 = clonedArr.lastIndexOf(x2Norm);
      const diff = ix2 - ix1;

      if (ix1 % 2 === 1) {
        if (diff % 2 === 1) {
          const sign = clonedArr[ix1 + diff + 1] ? 1 : -1;
          clonedArr.splice(ix1, diff + sign);
        } else {
          clonedArr.splice(ix1, diff);
        }
      } else {
        if (diff % 2 === 1) {
          clonedArr.splice(ix1 + 1, diff - 1);
        } else {
          const sign = clonedArr[ix1 + diff + 1] ? 0 : -1;
          clonedArr.splice(ix1 + 1, diff) + sign;
        }
      }
      return clonedArr;
    }, []);
    const consolidated = [];
    let counter = 0;
    while (r.length) {
      const cr = r.shift();
      if (cr === r[0] || cr + 1 === r[0]) {
        r.shift();
        continue;
      }
      consolidated.push(cr);
      counter++;
    }
    results.push(consolidated);
  }
  results.forEach((pos, i) => {
    if (pos.length > 2) {
      console.log((pos[1] + 1) * 4000000 + i);
    }
  });
})();
