export const PROJECT_NAME = 'stale-dep'

export const rcFileMap = {
  npm: ['.npmrc'],
  yarn: ['.yarnrc'],
  pnpm: ['.npmrc', 'pnpm-workspace.yaml', '.pnpmfile.cjs'],
  'pnpm@6': ['.npmrc', 'pnpm-workspace.yaml', '.pnpmfile.cjs'],
  bun: [],
} as const

// the order here matters, more specific one comes first
export const lockFileMap = {
  bun: 'bun.lockb',
  pnpm: 'pnpm-lock.yaml',
  'pnpm@6': 'pnpm-lock.yaml',
  yarn: 'yarn.lock',
  npm: 'package-lock.json',
} as const
export type PackageManager = keyof typeof lockFileMap
