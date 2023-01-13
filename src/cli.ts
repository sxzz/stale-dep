import { program } from 'commander'
import consola from 'consola'
import { INSTALL_COMMANDS, PROJECT_NAME } from './constant'
import {
  calcHash,
  calcMtime,
  checkHash,
  checkMtime,
  getPackageManager,
  storeHash,
  storeMtime,
} from '.'
import type { PackageManager } from './constant'

program.option('-u, --update')
program.parse(process.argv)

const options = program.opts<{ update: boolean }>()
run()

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

async function run() {
  try {
    const pm = await getPackageManager()
    if (options.update) {
      await update(pm)
    } else {
      await check(pm)
    }
  } catch (err) {
    consola.error(
      `[${PROJECT_NAME}]`,
      (err as Error).message ?? `Unknown error in ${PROJECT_NAME}.`
    )
    process.exit(1)
  }
}
