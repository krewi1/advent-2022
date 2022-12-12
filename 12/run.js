import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines } from "../helper/fileLoader.js";
import { printMatrix } from "../helper/matrix.js";
import { PriorityQueue } from "../helper/priorityQueue.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const lines = loadByLines(join(currentDir, "input.txt"))
  .filter(Boolean)
  .map((l) => [...l]);

(function run() {
  let starts = [];
  let end = [0, 0];
  function isEnd(position) {
    return end[0] === position[0] && end[1] === position[1];
  }
  const rows = lines.map((l, y) =>
    l.map((ch, x) => {
      if (ch === "S" || ch === "a") {
        starts.push([y, x]);
        return 1;
      }
      if (ch === "E") {
        end = [y, x];
        return 0;
      }
      return ch.charCodeAt() - 96;
    })
  );

  const visited = rows.map((r) => r.map((c) => 0));

  function visitPosition(position) {
    const height = rows[position[0]]?.[position[1]];

    const higherNeighbour = [];
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        if (Math.abs(y) === Math.abs(x)) continue;
        const neighbourY = position[0] + y;
        const neighbourX = position[1] + x;
        const heightEl = rows[neighbourY]?.[neighbourX];

        if (heightEl !== undefined) {
          const diff = heightEl - height;
          if (diff === -26) {
            return [[neighbourY, neighbourX]];
          }
          if (diff <= 1 && heightEl !== 0) {
            higherNeighbour.push([neighbourY, neighbourX]);
          }
        }
      }
    }
    // if (height === 15) {
    //   higherNeighbour.forEach((n) => console.log("15", n[0], n[1]));
    // }
    return higherNeighbour;
  }

  const trails = starts.map((start) => {
    const queue = new PriorityQueue((a, b) => a.length < b.length);
    queue.push({ length: 0, position: start });

    let item;
    while (queue.size()) {
      item = queue.enqueue();
      if (isEnd(item.position)) {
        break;
      }
      visited[item.position[0]][item.position[1]] = 1;
      const neighbours = visitPosition(item.position);
      queue.push(
        ...neighbours.map((n) => ({
          length: item.length + 1,
          position: n,
          parent: item,
        }))
      );
    }

    if (!isEnd(item.position)) {
      return 0;
    }
    return item.length;
  });

  console.log(Math.min(...trails.filter(Boolean)));
})();
