import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines } from "../helper/fileLoader.js";
import { printMatrix } from "../helper/matrix.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const lines = loadByLines(join(currentDir, "input.txt")).filter(Boolean);

const Instructions = {
  *noop(register) {
    yield register;
  },
  *addx(register, n) {
    const [item] = register;
    yield register;
    yield [item + +n];
  },
};
(function run() {
  let register = [1];
  let cycle = 1;
  const matrix = [];
  let currentRow;
  while (lines.length) {
    const [instr, n] = lines.shift().split(" ");
    const i = Instructions[instr](register, n);
    for (const it of i) {
      const rowPixel = (cycle % 40) - 1;
      if (rowPixel === 0) {
        currentRow = [];
        matrix.push(currentRow);
      }
      if (register[0] - 1 <= rowPixel && register[0] + 1 >= rowPixel) {
        currentRow.push("#");
      } else {
        currentRow.push(".");
      }
      register = it;
      cycle++;
    }
  }

  console.log(printMatrix(matrix));
})();
