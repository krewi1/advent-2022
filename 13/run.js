import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines } from "../helper/fileLoader.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const lines = loadByLines(join(currentDir, "input.txt")).filter(Boolean);
(function run() {
  const parsedLines = lines.map((line) => {
    return JSON.parse(line);
  });

  const first = [[2]];
  const second = [[6]];
  parsedLines.push(first);
  parsedLines.push(second);

  const res = parsedLines.sort((a, b) => {
    let result;
    checkArr(a, b, (res) => {
      if (result === undefined) {
        result = res;
      }
    });
    return result ? -1 : 1;
  });

  console.log("result", (res.indexOf(first) + 1) * (res.indexOf(second) + 1));

  function checkArr(l, r, f) {
    if (typeof l === "number" && typeof r === "number") {
      if (l > r) return f(false);
      if (l < r) return f(true);
      return;
    }
    if (Array.isArray(l) && Array.isArray(r)) {
      const bigger = Math.max(l.length, r.length);
      for (let i = 0; i < bigger; i++) {
        checkArr(l[i], r[i], f);
      }
      return;
    }

    if (!l || !r) {
      return f(!l);
    }

    if (Array.isArray(l)) {
      return checkArr(l, [r], f);
    } else {
      return checkArr([l], r, f);
    }
  }
})();
