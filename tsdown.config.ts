import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: './src/{index,cli,nuxt}.ts',
  exports: true,
})
