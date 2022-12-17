import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines, loadPure } from "../helper/fileLoader.js";
import { printMatrix } from "../helper/matrix.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const lines = loadPure(join(currentDir, "test.txt")).trim();
const moves = [...lines];

const Move = {
  "<": -1,
  ">": 1,
};

function* moveGen() {
  const length = moves.length;
  let index = 0;
  while (true) {
    const move = moves[index % length];
    yield Move[move];
    index++;
  }
}

function* shapeGen() {
  const length = shapes.length;
  let index = 0;
  while (true) {
    const shape = shapes[index % length];
    yield shape;
    index++;
  }
}

const shapes = [
  [
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
  ],
  [
    [0, 3],
    [1, 2],
    [1, 4],
    [2, 3],
  ],
  [
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 4],
    [2, 4],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
  ],
  [
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
  ],
];

// const iterations = 1000000000000;
const iterations = 2022;

(function run() {
  console.time();
  const mg = moveGen();
  const sg = shapeGen();
  const surface = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
  ];
  const depth = [new Array(7).fill(1)];

  for (let i = 1; i <= iterations; i++) {
    const shape = sg.next().value;
    const maxY = Math.max(...surface.map((i) => i[0]));
    let ss = shape.map(([y, x]) => [y + maxY + 4, x]);
    let c = false;
    while (!c) {
      const m = mg.next().value;

      // jet gas
      let newArr = [];
      let hasMove = true;
      for (let s = 0; s < ss.length; s++) {
        const [y, x] = ss[s];
        if (!depth[y]) depth[y] = new Array(7).fill(0);
        const newX = x + m;
        if (newX > -1 && newX < 7 && depth[y][newX] === 0) {
          newArr.push([y, newX]);
        } else {
          hasMove = false;
        }
      }
      if (hasMove) {
        ss = newArr;
      }

      // fall
      newArr = [];
      for (let s = 0; s < ss.length; s++) {
        const [y, x] = ss[s];
        const newY = y - 1;
        const dl = depth[newY];
        if (!dl || dl[x] === 0) {
          newArr.push([newY, x]);
        } else {
          c = true;
        }
      }

      if (!c) {
        ss = newArr;
      }
    }
    ss.forEach((s) => {
      const [y, x] = s;
      depth[y][x] = 1;
      surface[x] = [Math.max(y, surface[x][0]), x];
    });

    // let drawMetrix = depth.map((d) => [...d]);
    // const yL = drawMetrix.length;
    // const xL = drawMetrix[0].length;
    // for (let y = 0; y < yL; y++) {
    //   for (let x = 0; x < xL; x++) {
    //     drawMetrix[y][x] = depth[yL - y - 1][x];
    //   }
    // }
    // printMatrix(
    //   drawMetrix
    //     .filter((d) => d.some((i) => i === 1))
    //     .map((d) => d.map((i) => (i === 1 ? "#" : ".")))
    // );
    // console.log(space.map((s) => s[0]));
    // console.log();
  }
  console.timeEnd();
  console.log(Math.max(...surface.map((s) => s[0])));
})();
