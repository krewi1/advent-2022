import * as dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { mkdir, rm, copyFile, createWriteStream } from "fs";
import { promisify } from "util";
import { get } from "https";

dotenv.config();

const mkdirAsync = promisify(mkdir);
const rmDirAsync = promisify(rm);
const copyFileAsync = promisify(copyFile);

const currentDir = dirname(fileURLToPath(import.meta.url));
const [day] = process.argv.slice(2);

if (!day) {
  throw new Error("No day specified");
}

(async () => {
  const basePath = join(currentDir, "..", day);
  const filePath = join(basePath, "input.txt");
  const templatePath = join(currentDir, "template.js");
  const destScriptPath = join(basePath, "run.js");
  await mkdirAsync(basePath);
  const fileStream = createWriteStream(filePath);
  try {
    const response = await download(
      `https://adventofcode.com/2021/day/${day}/input`
    );
    response.pipe(fileStream);
    await new Promise((res) => fileStream.on("finish", res));
    await copyFileAsync(templatePath, destScriptPath);
  } catch (e) {
    console.log("there was a problem fetching the day", day, e);
    console.log("going to clean");
    await rmDirAsync(basePath, { recursive: true, force: true });
  }
})();

async function download(url) {
  return new Promise((res, rej) => {
    get(
      url,
      {
        headers: {
          cookie: `session=${process.env.SESSION}`,
        },
      },
      (response) => {
        res(response);
      }
    ).on("error", (e) => {
      rej(e);
    });
  });
}
