import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines } from "../helper/fileLoader.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const Oponent = {
  A: "rock",
  B: "paper",
  C: "scissors",
};

const My = {
  X: "rock",
  Y: "paper",
  Z: "scissors",
};

const Points = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

const Wons = new Map();
const Loose = new Map();

Wons.set("rock", "paper");
Wons.set("paper", "scissors");
Wons.set("scissors", "rock");

Loose.set("rock", "scissors");
Loose.set("paper", "rock");
Loose.set("scissors", "paper");

const lines = loadByLines(join(currentDir, "input.txt"))
  .filter(Boolean)
  .map((l) => l.split(" "));
(function run() {
  let points = 0;
  lines.forEach((line) => {
    const op = Oponent[line[0]];
    const my = line[1];

    if (my === "X") {
      console.log(Loose.get(op));
      points += Points[Loose.get(op)];
    } else if (my === "Y") {
      points += Points[op];
      points += 3;
    } else {
      points += Points[Wons.get(op)];
      points += 6;
    }
  });
  console.log(points);
})();
