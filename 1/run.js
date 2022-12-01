import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines } from "../helper/fileLoader.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const lines = loadByLines(join(currentDir, "input.txt")).map((l) => +l);
console.log(lines);
(function run() {
  const elves = [];
  let currentElf = [];
  lines.forEach((line) => {
    if (!line) {
      elves.push(currentElf);
      currentElf = [];
      return;
    }
    currentElf.push(line);
  });

  const elvesTotal = elves.map((elf) => elf.reduce((acc, c) => acc + c, 0));
  let sum = 0;
  for (let i = 0; i < 3; i++) {
    const max = Math.max(...elvesTotal);
    console.log(max);
    sum += max;
    const index = elvesTotal.indexOf(max);
    elvesTotal.splice(index, 1);
  }
  console.log(sum);
})();
