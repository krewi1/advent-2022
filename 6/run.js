import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines } from "../helper/fileLoader.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const lines = loadByLines(join(currentDir, "test.txt")).filter(Boolean);

const targetLength = 4;
(function run() {
  const buffers = [];
  let line = [...lines[0]];
  const first = line.splice(0, targetLength - 1);

  for (let i = 0; i < targetLength; i++) {
    const target = [...first];
    target.splice(0, i);
    const buffer = new Set(target);
    buffers.push(buffer);
  }

  let result;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    buffers.forEach((b) => b.add(char));
    if (buffers[0].size === targetLength) {
      result = i + targetLength;
      break;
    }
    buffers.shift();
    buffers.push(new Set());
  }

  console.log(result);
})();
