import process from 'node:process'
import { lstat, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import consola from 'consola'
import md5 from 'md5'
import { ensureDir } from 'fs-extra'
import { getProjectInfo } from './helper'
import {
  PMS,
  type PackageManager,
  cacheDir,
  hashFile,
  lockFileMap,
  mtimeFile,
  rcFileMap,
} from './constant'

export * from './constant'
export * from './command'

export async function getPackageManager(
  path: string = process.cwd(),
): Promise<PackageManager> {
  const pm = await getProjectInfo({ cwd: path })
  if (!pm) throw new Error('No package manager lock file found.')
  else if (!PMS.includes(pm)) throw new Error(`${pm} is not supported.`)
  return pm
}

export async function calcHash(
  packageManager: PackageManager,
): Promise<string> {
  let contents = (await readFile('package.json', 'utf-8')).trim().trim()
  try {
    const json = JSON.parse(contents)
    contents = JSON.stringify({
      dependencies: json.dependencies,
      devDependencies: json.devDependencies,
      peerDependencies: json.peerDependencies,
      peerDependenciesMeta: json.peerDependenciesMeta,
      bundleDependencies: json.bundleDependencies,
      optionalDependencies: json.optionalDependencies,
      workspaces: json.workspaces,
      pnpm: json.pnpm,
      scripts: {
        preinstall: json.scripts?.preinstall,
        install: json.scripts?.install,
        postinstall: json.scripts?.postinstall,
        prepublish: json.scripts?.prepublish,
        preprepare: json.scripts?.preprepare,
        prepare: json.scripts?.prepare,
        postprepare: json.scripts?.postprepare,
      },

      // https://classic.yarnpkg.com/en/docs/package-json#toc-flat
      flat: json.flat,
      // https://classic.yarnpkg.com/en/docs/package-json#toc-resolutions
      resolutions: json.resolutions,
      overrides: json.overrides,
    })
  } catch (error) {
    consola.warn(error)
  }

  const lockFile = lockFileMap[packageManager]
  contents += (await readFile(lockFile, 'utf-8')).trim()

  for (const rcFile of rcFileMap[packageManager]) {
    if (!existsSync(rcFile)) continue
    contents += (await readFile(rcFile, 'utf-8')).trim()
  }

  const hash = md5(contents, {
    encoding: 'binary',
  })
  return hash
}

export async function storeHash(hash: string): Promise<void> {
  await ensureDir(cacheDir)
  await writeFile(hashFile, hash)
}

export function getHash(): Promise<string> | undefined {
  if (!existsSync(hashFile)) return undefined
  return readFile(hashFile, 'utf-8').then((r) => r.trim())
}

export async function checkHash(
  packageManager: PackageManager,
): Promise<boolean> {
  return (await getHash()) === (await calcHash(packageManager))
}

export async function storeMtime(mtime: Record<string, number>): Promise<void> {
  await ensureDir(cacheDir)
  await writeFile(mtimeFile, JSON.stringify(mtime))
}

export function getMtime(): Promise<Record<string, number>> | undefined {
  if (!existsSync(mtimeFile)) return undefined
  return readFile(mtimeFile, 'utf-8').then((r) => JSON.parse(r))
}

export async function calcMtime(
  packageManager: PackageManager,
): Promise<Record<string, number>> {
  const mtime: Record<string, number> = {}

  mtime['package.json'] = await getFileMtime('package.json')

  const lockFile = lockFileMap[packageManager]
  mtime[lockFile] = await getFileMtime(lockFile)

  for (const rcFile of rcFileMap[packageManager]) {
    if (!existsSync(rcFile)) continue
    mtime[rcFile] = await getFileMtime(rcFile)
  }

  return mtime
}

export async function checkMtime(
  packageManager: PackageManager,
): Promise<boolean> {
  const cached = await getMtime()
  if (!cached) return false

  const current = await calcMtime(packageManager)
  return [...new Set([...Object.keys(cached), ...Object.keys(current)])].every(
    (k) => cached[k] === current[k],
  )
}

async function getFileMtime(file: string): Promise<number> {
  const { mtime } = await lstat(file)
  return mtime.getTime()
}
