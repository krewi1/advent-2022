import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines } from "../helper/fileLoader.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const lines = loadByLines(join(currentDir, "input.txt"))
  .filter(Boolean)
  .map((l) => {
    return new Set(l);
  });
(function run() {
  const groups = [];
  for (let i = 0; i < lines.length; i += 3) {
    groups.push([lines[i], lines[i + 1], lines[i + 2]]);
  }

  const commons = groups.map(toCommon);

  const anwer = commons.reduce(sumPriorities, 0);
  console.log(anwer);
})();

function toCommon([first, second, third]) {
  const iter = [...first];

  for (let i = 0; i < iter.length; i++) {
    const char = iter[i];
    if (second.has(char) && third.has(char)) {
      return char;
    }
  }
}

function sumPriorities(acc, curr) {
  const code = curr.charCodeAt();
  console.log(code);
  if (curr >= "a" && curr <= "z") {
    return acc + code - 96;
  }

  return acc + code - 38;
}
