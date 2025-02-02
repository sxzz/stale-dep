import path from 'node:path'
import process from 'node:process'

export const PROJECT_NAME = 'stale-dep'

export const rcFileMap = {
  npm: ['.npmrc'],
  yarn: ['.yarnrc'],
  pnpm: ['.npmrc', 'pnpm-workspace.yaml', '.pnpmfile.cjs'],
  bun: [],
} as const

// the order here matters, more specific one comes first
export const lockFileMap = {
  bun: 'bun.lockb',
  pnpm: 'pnpm-lock.yaml',
  yarn: 'yarn.lock',
  npm: 'package-lock.json',
} as const
export type PackageManager = keyof typeof lockFileMap

export const INSTALL_COMMANDS: Record<PackageManager, string> = {
  npm: 'npm install',
  yarn: 'yarn',
  pnpm: 'pnpm i',
  bun: 'bun install',
}

export const PMS = Object.keys(lockFileMap) as PackageManager[]
export const LOCKS: (
  | 'bun.lockb'
  | 'pnpm-lock.yaml'
  | 'yarn.lock'
  | 'package-lock.json'
)[] = Object.values(lockFileMap)
export const AGENTS_AND_LOCKS: [
  string,
  'bun.lockb' | 'pnpm-lock.yaml' | 'yarn.lock' | 'package-lock.json',
][] = Object.entries(lockFileMap)

export const cacheDir: string = path.resolve(
  process.cwd(),
  'node_modules/.cache',
)
export const hashFile: string = path.resolve(cacheDir, 'dep-hash')
export const mtimeFile: string = path.resolve(cacheDir, 'dep-mtime')
