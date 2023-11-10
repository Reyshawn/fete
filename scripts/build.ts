import { rollup, RollupOptions, OutputOptions, InputPluginOption, RollupBuild } from 'rollup';
import postcss from 'rollup-plugin-postcss'
import esbuild from 'rollup-plugin-esbuild'
import path from 'path';
import { dts } from "rollup-plugin-dts";

import { rm } from 'fs/promises';
import { existsSync } from 'fs'
import { glob } from "glob"
import { extractExternal } from './read-package'

const cwd = process.cwd()
const outputDir = path.join(cwd, "lib")


const mainOptions: RollupOptions = {
  input: 'src/index.ts',
  plugins: [
    esbuild({
      sourceMap: true,
      minify: true,
      target: "esnext"
    }),
    postcss({
      extract: true,
      minimize: true,
      modules: {
        generateScopedName: "fete_[local]_[hash:base64:7]",
      }
    }) as InputPluginOption,
  ],
  external: [] // dynamic inject
}


const dtsOptions: RollupOptions = {
  input: 'src/index.ts',
  plugins: [
    dts()
  ],
  external: [] // dynamic inject
}

const mainOutputList: OutputOptions[] = [{
  dir: "lib",
  format: "esm",
  preserveModules: true,
  entryFileNames: "[name].mjs",
  sourcemap: true
}]

const dtsOutputList: OutputOptions[] = [{
  dir: "lib",
  format: "esm",
  preserveModules: true,
  entryFileNames: "[name].d.ts"
}] 


async function build(input: RollupOptions, output: OutputOptions[]) {
  let bundle: RollupBuild | undefined
  try {
    // create a bundle
    bundle = await rollup(input);
    await generateOutputs(bundle, output);

  } catch (error) {
    console.error(error);
  } finally {
    bundle?.close()
  }
}


async function generateOutputs(bundle: RollupBuild, output: OutputOptions[]) {
  for (const option of output) {
    await bundle.write(option) 
  }
}


function generateCSSBundleOptions(): [RollupOptions, OutputOptions[]][] {
  return glob
  .sync(path.join(cwd, 'src/**/*.module.css'))
  .map(file => {
    const source = path.relative("src", file)
    return [
      {
        input: "src/" + source,
        plugins: [
          postcss({
            extract: true,
            minimize: true,
            modules: {
              generateScopedName: "fete_[local]_[hash:base64:7]",
            }
          }) as InputPluginOption,
        ],
      },
      [
        {
          file: "lib/" + source.replace(/\.module(?=\.css$)/gm, ""),
        }
      ]
    ]
  })
}

function buildCSS() {
  const options = generateCSSBundleOptions()

  for (const [input, output] of options) {
    build(input, output)
  }
}


async function main() {
  if (existsSync(outputDir)) {
    await rm(outputDir, { recursive: true })
  }

  const external = await extractExternal()

  mainOptions.external = external
  dtsOptions.external=  external 

  build(mainOptions, mainOutputList)
  build(dtsOptions, dtsOutputList)
  buildCSS()
}


main()