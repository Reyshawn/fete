import { defineConfig } from 'tsup'

export default defineConfig({
  outDir: "lib",
  sourcemap: true,
  minify: true,
  clean: true,
  format: [
    "esm"
  ],
  loader: {
    '.css': 'local-css',
  }
})