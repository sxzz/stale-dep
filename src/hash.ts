import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import consola from 'consola'
import { cacheDir, hashFile, rcFileMap } from './constant'
import { ensureDir, getLockfiles, tryRead } from './utils'
import type { AgentName } from 'package-manager-detector'

export async function calcHash(packageManager: AgentName): Promise<string> {
  const hash = createHash('sha1')

  const pkgJson = (await readFile('package.json', 'utf8')).trim()
  try {
    const json = JSON.parse(pkgJson)
    const data = JSON.stringify({
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
    hash.update(Buffer.from(data))
  } catch (error) {
    consola.warn(error)
  }

  for (const lockfileName of getLockfiles(packageManager)) {
    hash.update(await readFile(lockfileName).catch(() => Buffer.alloc(0)))
  }

  for (const rcFile of rcFileMap[packageManager]) {
    hash.update(await readFile(rcFile).catch(() => Buffer.alloc(0)))
  }

  return hash.digest('hex')
}

export async function storeHash(hash: string): Promise<void> {
  await ensureDir(cacheDir)
  await writeFile(hashFile, hash)
}

export function getHash(): Promise<string | undefined> {
  return tryRead(hashFile)
}

export async function checkHash(packageManager: AgentName): Promise<boolean> {
  return (await getHash()) === (await calcHash(packageManager))
}
