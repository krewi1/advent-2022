import { EOL } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines, loadPure } from "../helper/fileLoader.js";
import { transpose } from "../helper/matrix.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

let lines = loadPure(join(currentDir, "input.txt")).split(EOL);
(function run() {
  let map = [];
  while (true) {
    const l = lines.shift();
    if (!l) {
      break;
    }
    map.push(l);
  }
  lines = lines.filter(Boolean);

  map.pop();
  map = map.map((i) =>
    [
      ...i
        .replace(/\[/g, "")
        .replace(/\]/g, "")
        .replace(/\s\s\s\s/g, "-"),
    ].filter((i) => i !== " ")
  );

  map = transpose(map);
  map = map.map((column) => column.filter((c) => c !== "-"));
  console.log(map);

  while (lines.length) {
    let [, move, , from, , to] = lines.shift().split(" ");
    move = +move;
    from = +from - 1;
    to = +to - 1;
    const fromCol = map[from];
    let stack = fromCol.splice(0, move);
    map[to].unshift(...stack);
  }
  console.log(map.map((c) => c[0]).join(""));
})();
