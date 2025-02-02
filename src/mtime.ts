import { lstat, writeFile } from 'node:fs/promises'
import { cacheDir, mtimeFile, rcFileMap } from './constant'
import { ensureDir, getLockfiles, tryRead } from './utils'
import type { AgentName } from 'package-manager-detector'

export async function storeMtime(mtime: Record<string, number>): Promise<void> {
  await ensureDir(cacheDir)
  await writeFile(mtimeFile, JSON.stringify(mtime))
}

export async function getMtime(): Promise<Record<string, number> | undefined> {
  const contents = await tryRead(mtimeFile)
  if (!contents) return undefined
  return JSON.parse(contents)
}

export async function calcMtime(
  packageManager: AgentName,
): Promise<Record<string, number>> {
  const mtime: Record<string, number> = {}

  mtime['package.json'] = await getFileMtime('package.json')

  for (const lockfileName of getLockfiles(packageManager)) {
    mtime[lockfileName] = await getFileMtime(lockfileName)
  }

  for (const rcFile of rcFileMap[packageManager]) {
    mtime[rcFile] = await getFileMtime(rcFile)
  }

  return mtime
}

export async function checkMtime(packageManager: AgentName): Promise<boolean> {
  const cached = await getMtime()
  if (!cached) return false

  const current = await calcMtime(packageManager)
  return [...new Set([...Object.keys(cached), ...Object.keys(current)])].every(
    (k) => cached[k] === current[k],
  )
}

async function getFileMtime(file: string): Promise<number> {
  try {
    const { mtime } = await lstat(file)
    return mtime.getTime()
  } catch {
    return -1
  }
}
