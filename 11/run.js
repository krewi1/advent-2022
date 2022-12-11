import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines } from "../helper/fileLoader.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const lines = loadByLines(join(currentDir, "input.txt"));
const rounds = 10000;
(function run() {
  let monkeys = [];
  let monkey = [];
  while (lines.length) {
    const line = lines.shift();
    if (!line) {
      monkeys.push(monkey);
      monkey = [];
      continue;
    }
    monkey.push(line);
  }

  monkeys = monkeys.map((monkey) => {
    const [, items] = monkey[1].split(":");
    const itemsList = items
      .split(",")
      .filter(Boolean)
      .map((i) => +i.trim());
    const [, op] = monkey[2].split(":");
    const realOp = op.trim().replace("new", "n");
    const tes = +monkey[3].split(" ").at(-1);
    const t = +monkey[4].split(" ").at(-1);
    const f = +monkey[5].split(" ").at(-1);
    return {
      items: itemsList,
      op: realOp,
      test: tes,
      t,
      f,
    };
  });

  const commonSpace = monkeys
    .map(({ test }) => test)
    .reduce((acc, n) => acc * n);
  let inspects = monkeys.map((_) => 0);
  for (let round = 0; round < rounds; round++) {
    for (let i = 0; i < monkeys.length; i++) {
      const monkey = monkeys[i];
      inspects[i] = inspects[i] + monkey.items.length;
      while (monkey.items.length) {
        let old = monkey.items.shift();
        let n;
        eval(monkey.op);
        const test = n % commonSpace;
        if (test % monkey.test === 0) {
          monkeys[monkey.t].items.push(test);
        } else {
          monkeys[monkey.f].items.push(test);
        }
      }
    }
  }
  inspects = inspects.sort((a, b) => b - a);
  console.log(inspects[0] * inspects[1]);
})();
