import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines } from "../helper/fileLoader.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const lines = loadByLines(join(currentDir, "input.txt"))
  .filter(Boolean)
  .map((l) => l.split(",").map((ch) => +ch));

function getKey(point) {
  return point.join(":");
}

const pointMap = lines.reduce((acc, point) => {
  acc.set(getKey(point), point);
  return acc;
}, new Map());

const top = [0, 1, 0];
const down = [0, -1, 0];
const left = [-1, 0, 0];
const right = [1, 0, 0];
const up = [0, 0, 1];
const bottom = [0, 0, -1];
const sides = [top, down, left, right, up, bottom];
const flowAble = new Set();

(function run() {
  const xs = lines.map(([x]) => x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const ys = [...lines.map(([, y]) => y)];
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const zs = [...lines.map(([, , z]) => z)];
  const minZ = Math.min(...zs);
  const maxZ = Math.max(...zs);

  function reachBoundary([x, y, z]) {
    return x < minX || x > maxX || y < minY || y > maxY || z < minZ || z > maxZ;
  }

  function canFlow(point, prevPointKeys = new Set()) {
    if (flowAble.has(getKey(point))) {
      return true;
    }

    prevPointKeys.add(getKey(point));
    if (pointMap.has(getKey(point))) {
      return false;
    }
    const directions = sides
      .map(([sx, sy, sz]) => [point[0] + sx, point[1] + sy, point[2] + sz])
      .filter((dir) => !prevPointKeys.has(getKey(dir)));

    if (directions.some((point) => reachBoundary(point))) {
      flowAble.add(getKey([point[0], point[1], point[2]]));
      return true;
    }

    return directions.some((dir) => canFlow(dir, prevPointKeys));
  }

  const visible = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      for (let z = minZ; z <= maxZ; z++) {
        const item = pointMap.get(getKey([x, y, z]));
        if (x === 2 && y === 2 && z === 5) {
          console.log();
        }
        if (!item) {
          continue;
        }

        const siblings = sides.reduce((acc, [sx, sy, sz]) => {
          const sibling = [x + sx, y + sy, z + sz];
          if (sibling[0] === 2 && sibling[1] === 2 && sibling[2] === 5) {
            console.log();
          }
          return pointMap.has(getKey(sibling)) || !canFlow(sibling)
            ? acc + 1
            : acc;
        }, 0);
        visible.push(6 - siblings);
      }
    }
  }

  console.log(visible.reduce((acc, curr) => acc + curr, 0));
})();
