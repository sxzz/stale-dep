import path from 'node:path'
import process from 'node:process'
import type { AgentName } from 'package-manager-detector'

export const PROJECT_NAME = 'stale-dep'

export const rcFileMap: Record<AgentName, string[]> = {
  npm: ['.npmrc'],
  yarn: ['.yarnrc'],
  pnpm: ['.npmrc', 'pnpm-workspace.yaml', '.pnpmfile.cjs'],
  bun: [],
  deno: [],
}

export const cacheDir: string = path.resolve(
  process.cwd(),
  'node_modules/.cache',
)
export const hashFile: string = path.resolve(cacheDir, 'dep-hash')
export const mtimeFile: string = path.resolve(cacheDir, 'dep-mtime')
