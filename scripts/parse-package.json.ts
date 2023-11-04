import { readFile, writeFile, copyFile } from 'fs/promises';
import * as path from 'path';

const cwd = process.cwd()
const sourcePath = path.join(cwd, "package.json")
const retorePath = path.join(cwd, "package.json.backup")
const command = process.argv[2]

async function restore() {
  await copyFile(retorePath, sourcePath)
}

async function prepare() {
  await copyFile(sourcePath, retorePath)
  const packageJsonString = await readFile(sourcePath, "utf-8")

  const pkgObj = JSON.parse(packageJsonString)


  const copy: { [index: string]: string | any[] | Object } = {}
  for (const key in pkgObj) {
    if (key === "scripts") {
      continue
    }

    if (key === "main") {
      copy["main"] = "lib/index.mjs"
      copy["module"] = "lib/index.mjs"
      copy["types"] = "lib/index.d.ts"
      copy["files"] = ["lib"]
      copy["exports"] = {
        ".": {
          types: "./lib/index.d.ts",
          import: "./lib/index.mjs"
        }
      }
    } else {
      copy[key] = pkgObj[key]
    }
  }

  await writeFile(sourcePath, JSON.stringify(copy, null, 2))
}


async function main() {
  try {
    switch (command) {
      case "restore":
        await restore()
        break
      default:
        await prepare()
    }
  } catch (e) {
    console.error(e)
  }
}

main()
