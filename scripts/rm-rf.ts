import { rmSync } from "node:fs";

const pathToRemove = process.argv[2];

if (!pathToRemove) {
  throw new Error("Path-to-delete argument is missing");
}

rmSync(pathToRemove, { recursive: true, force: true });
