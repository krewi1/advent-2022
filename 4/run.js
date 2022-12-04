import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines } from "../helper/fileLoader.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const lines = loadByLines(join(currentDir, "input.txt"))
  .filter(Boolean)
  .map((line) => {
    return line.split(",");
  });
(function run() {
  let counter = 0;
  lines.forEach((line) => {
    const [left, right] = line;
    const [lFrom, lTo] = left.split("-").map((i) => +i);
    const [rFrom, rTo] = right.split("-").map((i) => +i);
    // First solution
    /*if ((lFrom <= rFrom && lTo >= rTo) || (rFrom <= lFrom && rTo >= lTo)) {
      counter++;
    }*/
    // second
    if ((lFrom <= rFrom && rFrom <= lTo) || (rFrom <= lFrom && lFrom <= rTo)) {
      counter++;
    }
  });
  console.log(counter);
})();
