import consola from 'consola'
import { resolveCommand, type AgentName } from 'package-manager-detector'
import {
  calcHash,
  calcMtime,
  checkHash,
  checkMtime,
  storeHash,
  storeMtime,
} from './index'

export async function update(pm: AgentName): Promise<void> {
  await Promise.all([
    calcHash(pm).then((hash) => storeHash(hash)),
    calcMtime(pm).then((mtime) => storeMtime(mtime)),
  ])
  consola.success('Successfully store the dependency hash')
}

export async function check(pm: AgentName): Promise<void> {
  if (!(await checkMtime(pm)) && !(await checkHash(pm))) {
    const cmd = resolveCommand(pm, 'install', [])
    if (!cmd) throw new Error(`No install command found for ${pm}.`)

    const cmdStr = `${cmd.command} ${cmd.args.join(' ')}`
    throw new Error(
      `Your node_modules is stale. Please run \`${cmdStr}\` first.`,
    )
  }
}
