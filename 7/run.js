import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines } from "../helper/fileLoader.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const diskSpace = 70000000;
const unused = 30000000;
const lines = loadByLines(join(currentDir, "input.txt")).filter(Boolean);
(function run() {
  const [first, ...rest] = lines;
  let node = { path: "/", children: [], parent: null };
  const root = node;
  rest.forEach((line) => {
    if (line.indexOf("$") > -1) {
      const [, command, to] = line.split(" ");
      if (command === "cd") {
        if (to === "..") {
          node = node.parent;
        } else {
          const currentNode = { path: to, children: [], parent: node };
          node.children.push(currentNode);
          node = currentNode;
        }
      }
    } else {
      const [size, file] = line.split(" ");
      const currentNode = {
        path: file,
        children: [],
        parent: node,
        size: +size,
      };
      node.children.push(currentNode);
    }
  });

  const directories = [];
  function calcSize(node) {
    return node.children.reduce((acc, child) => {
      if (!child.size) {
        const size = calcSize(child);
        directories.push(size);
        return acc + size;
      }
      return acc + child.size;
    }, 0);
  }
  const total = calcSize(root);
  const left = diskSpace - total;
  const need = unused - left;

  let min = Infinity;
  directories.forEach((dir) => {
    if (dir > need && dir < min) {
      min = dir;
    }
  });
  console.log(
    directories.filter((f) => f <= 100000).reduce((acc, curr) => acc + curr, 0)
  );
  console.log(min);
})();
