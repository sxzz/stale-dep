import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/{index,cli,nuxt}.ts'],
  format: ['esm'],
  target: 'node20.18',
  clean: true,
  dts: true,
})
