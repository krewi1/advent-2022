import { TIMEOUT } from "dns";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadByLines } from "../helper/fileLoader.js";
import { createCombinations } from "../helper/combinations.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

const lines = loadByLines(join(currentDir, "test.txt")).filter(Boolean);
(function run() {
  const pl = lines.map((l) => {
    let [, name, , , rate, , , , , ...valves] = l.split(" ");
    valves = valves.map((v) => v.replace(",", ""));
    [, rate] = rate.split("=");
    rate = rate.replace(";", "");

    return [name, parseInt(rate), ...valves];
  });

  const nodeMap = pl.reduce((acc, [name, rate, ...valves]) => {
    acc.set(name, { name, rate, valves });
    return acc;
  }, new Map());

  let priorityStack = [...nodeMap.values()]
    .sort((a, b) => (a.rate < b.rate ? 1 : -1))
    .filter((n) => n.rate > 0);
  let cn = nodeMap.get("AA");

  const shortestPathCache = new Map();
  function shortestPath() {
    const leaves = [];
    return {
      findPath(from, to, visited = new Set(), path = []) {
        const n1 = nodeMap.get(from);
        if (n1.name === to) {
          leaves.push(path);
          return;
        }
        const vc = new Set(visited);
        const p = [...path];
        vc.add(from);
        p.push(from);
        const nexts = n1.valves.filter((v) => !vc.has(v));
        if (!nexts.length) {
          return;
        }
        nexts.forEach((n) => this.findPath(n, to, vc, p));
      },
      dist(from, to) {
        this.findPath(from, to);
        const lengths = leaves.map((l) => l.length);
        const shortest = Math.min(...lengths);
        shortestPathCache.set(`${from}:${to}`, shortest);
        shortestPathCache.set(`${to}:${from}`, shortest);
        return shortest;
      },
      cached(from, to) {
        return (
          shortestPathCache.get(`${from}:${to}`) ||
          shortestPathCache.get(`${to}:${from}`)
        );
      },
    };
  }

  const calculatedCache = new Map();
  function visitNode(currentNode, time, ps) {
    if (time < 0) {
      return 0;
    }
    if (currentNode.rate) {
      time--;
    }
    const stackKey = [...ps.map((n) => n.name), time].join(":");

    if (!ps.length) {
      return time * currentNode.rate;
    }

    const releases = [];
    for (let i = 0; i < ps.length; i++) {
      const node = ps[i];
      const cps = ps.filter((n) => n.name !== node.name);
      const shortestPathToNode = shortestPath();
      const length =
        shortestPathToNode.cached(currentNode.name, node.name) ??
        shortestPathToNode.dist(currentNode.name, node.name);
      releases.push(
        time * currentNode.rate + visitNode(node, time - length, cps)
      );
    }

    const max = Math.max(...releases);
    calculatedCache.set(stackKey, max);
    return max;
  }
  console.log("ps", priorityStack.length);
  let cps = priorityStack.filter((n) => n.name !== cn.name);
  const temp = createCombinations(cps, Math.ceil(cps.length / 2));
  const releases = [];
  console.log(temp.length);
  let counter = 0;
  while (temp.length) {
    console.log("variation", counter++);
    const me = temp.shift();
    const el = cps.filter((n) => me.indexOf(n) === -1);
    const releaseMe = visitNode(cn, 26, me);
    const releaseEl = visitNode(cn, 26, el);
    const release = releaseMe + releaseEl;
    releases.push(release);
  }
  console.log(Math.max(...releases));
})();
