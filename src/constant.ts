import path from 'node:path'

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
export const LOCKS = Object.values(lockFileMap)
export const AGENTS_AND_LOCKS = Object.entries(lockFileMap)

export const cacheDir = path.resolve(process.cwd(), 'node_modules/.cache')
export const hashFile = path.resolve(cacheDir, 'dep-hash')
export const mtimeFile = path.resolve(cacheDir, 'dep-mtime')
