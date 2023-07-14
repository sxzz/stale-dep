import { basename, resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { findUp } from 'find-up'
import { AGENTS_AND_LOCKS, LOCKS, type PackageManager } from './constant'

// fork from https://github.com/antfu/ni/blob/main/src/detect.ts, but remove some unnecessary functions here.
export const getProjectInfo = async ({
  cwd,
}: { cwd?: string } = {}): Promise<PackageManager | null> => {
  let pm: PackageManager | null = null

  const lockPath = await findUp(LOCKS, { cwd })
  let packageJsonPath: string | null = null
  if (lockPath) {
    packageJsonPath = resolve(lockPath, '../package.json')
  } else {
    packageJsonPath = (await findUp('package.json')) ?? null
  }

  // read `packageManager` field in package.json
  if (packageJsonPath && existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(await readFile(packageJsonPath, 'utf8'))
      if (typeof pkg.packageManager === 'string') {
        const [name] = pkg.packageManager.split('@')
        return name as PackageManager | null
      }
    } catch {}
  }

  // detect lockfile
  if (!pm && lockPath) {
    const lockFile = basename(lockPath)
    pm =
      (AGENTS_AND_LOCKS.find(
        ([, lock]) => lock === lockFile
      )?.[0] as PackageManager) ?? null
  }
  return pm
}
