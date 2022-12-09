import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines } from "../helper/fileLoader.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const lines = loadByLines(join(currentDir, "input.txt")).filter(Boolean);

const Move = {
  U: [-1, 0],
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
};

(function run() {
  const ropeDists = new Array(10).fill().map(() => [0, 0]);
  const tail = ropeDists[ropeDists.length - 1];
  const visited = new Set();

  lines.forEach((line) => {
    let [dir, times] = line.split(" ");
    const move = Move[dir];
    times = +times;

    while (times) {
      let cHead = ropeDists[0];
      cHead[0] += move[0];
      cHead[1] += move[1];

      for (let j = 1; j < ropeDists.length; j++) {
        const cTail = ropeDists[j];
        if (Math.abs(cHead[0]) >= 2 || Math.abs(cHead[1]) >= 2) {
          const tMove = cHead.map(Math.sign);
          cTail[0] += tMove[0];
          cTail[1] += tMove[1];
          cHead[0] -= tMove[0];
          cHead[1] -= tMove[1];
        }
        cHead = cTail;
      }
      visited.add(`${tail[0]}:${tail[1]}`);
      times--;
    }
  });
  console.log(visited.size);
})();
