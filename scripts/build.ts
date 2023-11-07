import { rollup, RollupOptions, OutputOptions, InputPluginOption } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss'
import path from 'path';

import { writeFile } from 'fs';


const inputOptions: RollupOptions = {
  input: 'src/index.ts',
  plugins: [
    // resolve(),
    // commonjs(),
    typescript({
      jsx: "react-jsx"
    }),
    postcss({
      extract: true,
      minimize: true
    }) as InputPluginOption,
  ],
  external: ['react', 'react-dom', 'react/jsx-runtime']
};

// you can create multiple outputs from the same input to generate e.g.
// different formats like CommonJS and ESM
const outputOptionsList: OutputOptions[] = [{
  dir: "lib",
  format: "esm",
  preserveModules: true,
}];



build();

async function build() {
  let bundle;
  let buildFailed = false;
  try {
    // create a bundle
    bundle = await rollup(inputOptions);

    // an array of file names this bundle depends on
    console.log(bundle.watchFiles);

    await generateOutputs(bundle);

    // await bundle.write(outputOptionsList)
  } catch (error) {
    buildFailed = true;
    // do some error reporting
    console.error(error);
  }
  if (bundle) {
    // closes the bundle
    await bundle.close();
  }
  process.exit(buildFailed ? 1 : 0);
}


async function generateOutputs(bundle) {
  for (const outputOptions of outputOptionsList) {
    // generate output specific code in-memory
    // you can call this function multiple times on the same bundle object
    // replace bundle.generate with bundle.write to directly write to disk
    //const { output } = await bundle.generate(outputOptions);

    await bundle.write(outputOptions)
    // for (const chunkOrAsset of output) {
    //   if (chunkOrAsset.type === 'asset') {
    //     // For assets, this contains
    //     // {
    //     //   fileName: string,              // the asset file name
    //     //   source: string | Uint8Array    // the asset source
    //     //   type: 'asset'                  // signifies that this is an asset
    //     // }
    //     console.log('Asset', chunkOrAsset);
    //   } else {
    //     // For chunks, this contains
    //     // {
    //     //   code: string,                  // the generated JS code
    //     //   dynamicImports: string[],      // external modules imported dynamically by the chunk
    //     //   exports: string[],             // exported variable names
    //     //   facadeModuleId: string | null, // the id of a module that this chunk corresponds to
    //     //   fileName: string,              // the chunk file name
    //     //   implicitlyLoadedBefore: string[]; // entries that should only be loaded after this chunk
    //     //   imports: string[],             // external modules imported statically by the chunk
    //     //   importedBindings: {[imported: string]: string[]} // imported bindings per dependency
    //     //   isDynamicEntry: boolean,       // is this chunk a dynamic entry point
    //     //   isEntry: boolean,              // is this chunk a static entry point
    //     //   isImplicitEntry: boolean,      // should this chunk only be loaded after other chunks
    //     //   map: string | null,            // sourcemaps if present
    //     //   modules: {                     // information about the modules in this chunk
    //     //     [id: string]: {
    //     //       renderedExports: string[]; // exported variable names that were included
    //     //       removedExports: string[];  // exported variable names that were removed
    //     //       renderedLength: number;    // the length of the remaining code in this module
    //     //       originalLength: number;    // the original length of the code in this module
    //     //       code: string | null;       // remaining code in this module
    //     //     };
    //     //   },
    //     //   name: string                   // the name of this chunk as used in naming patterns
    //     //   preliminaryFileName: string    // the preliminary file name of this chunk with hash placeholders
    //     //   referencedFiles: string[]      // files referenced via import.meta.ROLLUP_FILE_URL_<id>
    //     //   type: 'chunk',                 // signifies that this is a chunk
    //     // }
    //     console.log('Chunk', chunkOrAsset.fileName);
// 
// 
    //    //  await writeFile(
    //    //    path.resolve(__dirname, chunkOrAsset.fileName),
    //    //    chunkOrAsset.module.code,
    //    //    
    //    //  )
// 
    //     // console.log('chunk::::', chunkOrAsset)
    //   }
    // }
  }
}
