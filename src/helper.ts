import { basename, resolve } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'
import { findUp } from 'find-up'
import consola from 'consola'
import { PROJECT_NAME, lockFileMap } from './constant'

export type Agent = 'npm' | 'pnpm' | 'yarn' | 'bun' | 'yarn@berry' | 'pnpm@6'

const LOCKS = Object.values(lockFileMap)
const AGENTS_AND_LOCKS = Object.entries(lockFileMap)

export const detectPackageManager = async () => {
  // fork from https://github.com/antfu/ni/blob/main/src/detect.ts, but remove some unnecessary functions here.
  let agent: Agent | null = null
  const lockPath = await findUp(LOCKS, { cwd: undefined })
  let packageJsonPath: string | null = null
  if (lockPath) {
    packageJsonPath = resolve(lockPath, '../package.json')
  } else {
    packageJsonPath = (await findUp('package.json')) ?? null
  }
  // read `packageManager` field in package.json
  if (packageJsonPath && existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
      if (typeof pkg.packageManager === 'string') {
        const [name, version] = pkg.packageManager.split('@')
        if (name === 'yarn' && Number.parseInt(version) > 1) {
          agent = 'yarn@berry'
        } else if (name === 'pnpm' && Number.parseInt(version) < 7) {
          agent = 'pnpm@6'
        } else if (AGENTS_AND_LOCKS.some(([agent]) => agent === name)) {
          agent = AGENTS_AND_LOCKS.find(
            ([agent]) => agent === name
          )![0] as Agent
        } else {
          consola.warn(
            `[${PROJECT_NAME}] Unknown packageManager:`,
            pkg.packageManager
          )
        }
      }
    } catch {}
  }

  // detect lockfile
  if (!agent && lockPath) {
    const lockFile = basename(lockPath)
    agent =
      (AGENTS_AND_LOCKS.find(([, lock]) => lock === lockFile)?.[0] as Agent) ??
      null
  }
  return agent
}
