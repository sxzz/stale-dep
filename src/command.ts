import consola from 'consola'
import { INSTALL_COMMANDS } from './constant'
import {
  calcHash,
  calcMtime,
  checkHash,
  checkMtime,
  storeHash,
  storeMtime,
  type PackageManager,
} from '.'

export async function update(pm: PackageManager) {
  await Promise.all([
    calcHash(pm).then((hash) => storeHash(hash)),
    calcMtime(pm).then((mtime) => storeMtime(mtime)),
  ])
  consola.success('Successfully store the dependency hash')
}

export async function check(pm: PackageManager) {
  if (!(await checkMtime(pm)) && !(await checkHash(pm))) {
    const cmd = INSTALL_COMMANDS[pm]
    throw new Error(`Your node_modules is stale. Please run \`${cmd}\` first.`)
  }
}
