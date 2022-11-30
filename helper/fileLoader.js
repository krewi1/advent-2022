import { readFileSync } from "fs";
import { EOL } from "os";

export function loadPure(path) {
  return readFileSync(path).toString();
}

export function loadByLines(path) {
  return readFileSync(path)
    .toString()
    .split(EOL)
    .map((l) => l.trim());
}

export function loadNumbersByLines(path) {
  return loadByLines(path).map((l) => +l);
}
