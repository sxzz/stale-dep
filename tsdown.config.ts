import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src'],
  format: ['cjs', 'esm'],
  target: 'node16.14',
  clean: true,
  dts: true,
})
