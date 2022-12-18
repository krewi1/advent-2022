import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines } from "../helper/fileLoader.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const lines = loadByLines(join(currentDir, "test.txt"))
  .filter(Boolean)
  .map((l) => l.split(",").map((ch) => +ch));

const mesh = new Map();

const top = [0, 1];
const down = [0, -1];
const left = [-1, 0];
const right = [1, 0];
const sides = [top, down, left, right];
(function run() {
  lines.forEach(([x, y, z]) => {
    const key = `${x}:${y}`;
    const meshZs = mesh.get(key) ?? [];
    meshZs.push(z);
    mesh.set(key, meshZs);
  });
  const xs = lines.map(([x]) => x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const ys = [...lines.map(([, y]) => y)];
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const visible = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const zs = mesh.get(`${x}:${y}`) ?? [];
      if (!zs.length) {
        continue;
      }
      let visibleSides = zs.reduce((acc, curr) => {
        const topAdjenced = zs.indexOf(curr + 1) !== -1 ? -1 : 0;
        const downAdjenced = zs.indexOf(curr - 1) !== -1 ? -1 : 0;
        return acc + 6 + topAdjenced + downAdjenced;
      }, 0);

      visible.push(
        sides.reduce((acc, [sx, sy]) => {
          const currX = x + sx;
          const currY = y + sy;
          const szs = mesh.get(`${currX}:${currY}`) ?? [];
          const sameSides = szs.reduce(
            (acc, curr) => (zs.indexOf(curr) !== -1 ? acc + 1 : acc),
            0
          );
          return acc - sameSides;
        }, visibleSides)
      );
    }
  }

  console.log(visible.reduce((acc, curr) => acc + curr, 0));
})();
