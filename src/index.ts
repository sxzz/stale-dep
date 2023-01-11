import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { existsSync } from 'node:fs'
import consola from 'consola'
import md5 from 'md5'
import { ensureDir } from 'fs-extra'
import { getProjectInfo } from './helper'
import { PMS, lockFileMap, rcFileMap } from './constant'
import type { PackageManager } from './constant'

export async function getPackageManager(
  path: string = process.cwd()
): Promise<PackageManager> {
  const pm = await getProjectInfo({ cwd: path })
  if (!pm) throw new Error('No package manager lock file found.')
  else if (!PMS.includes(pm)) throw new Error(`${pm} is not supported.`)
  return pm
}

export async function calcHash(
  packageManager: PackageManager
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
  } catch (err) {
    consola.warn(err)
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

const cacheDir = path.resolve(process.cwd(), 'node_modules/.cache')
const hashFile = path.resolve(cacheDir, 'dep-hash')
export async function storeHash(hash: string): Promise<void> {
  await ensureDir(cacheDir)
  await writeFile(hashFile, hash)
}

export function getHash(): Promise<string> | undefined {
  if (!existsSync(hashFile)) return undefined
  return readFile(hashFile, 'utf-8').then((r) => r.trim())
}

export async function checkHash(
  packageManager: PackageManager
): Promise<boolean> {
  return (await getHash()) === (await calcHash(packageManager))
}
