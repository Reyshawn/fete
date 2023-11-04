import { defineConfig } from 'tsup'

export default defineConfig({
  sourcemap: true,
  minify: true,
  clean: true,
  format: [
    "esm"
  ]
})