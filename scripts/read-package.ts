import { readFile } from "fs/promises";
import path from "path";

const cwd = process.cwd()

interface PackageJson {
  name: string;
  version: string;
  description?: string;
  keywords?: string;
  homepage?: string;
  license?: string;
  author?: string
  files?: string[];
  main?: string;
  browser?: string;
  bin?: Record<string, string>;
  man?: string;
  directories?: {
    lib?: string;
    bin?: string;
    man?: string;
    doc?: string;
    example?: string;
    test?: string;
  };
  repository?: {
    type?: 'git';
    url?: string;
    directory?: string;
  };
  scripts?: Record<string, string>;
  config?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  bundledDependencies?: string[];
  engines?: Record<string, string>;
  os?: string[];
  cpu?: string[];
}


export async function readPackage(): Promise<PackageJson> {
  try {
    const pkg = await readFile(path.join(cwd, "package.json"), "utf-8")
    return JSON.parse(pkg)
  } catch (err) {
    console.error(err)
    throw err
  }  
}

export async function extractExternal() {
  const hardCoded = ['react', 'react-dom', 'react/jsx-runtime']
  try {
    const pkg = await readPackage()
    const peer = Object.keys(pkg.peerDependencies ?? {})
    const deps = Object.keys(pkg.dependencies ?? {})

    return [...hardCoded, ...peer, ...deps]
  } catch (err) {
    console.error(err)
    throw err
  }
}
