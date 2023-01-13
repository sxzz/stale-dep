import { program } from 'commander'
import consola from 'consola'
import { PROJECT_NAME } from './constant'
import {
  calcHash,
  calcModifyTimeStamps,
  checkHash,
  checkModifyTimeStamps,
  getPackageManager,
  storeHash,
  storeModifyTimeStamps,
} from '.'
import type { PackageManager } from './constant'

program.option('-u, --update')
program.parse(process.argv)

const options = program.opts<{ update: boolean }>()
run()

export async function update(pm: PackageManager) {
  await storeHash(await calcHash(pm))
  await storeModifyTimeStamps(await calcModifyTimeStamps(pm))
  consola.success('Successfully store the dependency hash')
}

export async function check(pm: PackageManager) {
  if (!(await checkModifyTimeStamps(pm)) && !(await checkHash(pm))) {
    const installCommand = {
      npm: 'npm install',
      yarn: 'yarn',
      pnpm: 'pnpm i',
      'pnpm@6': 'pnpm i',
      bun: 'bun install',
    }[pm]
    throw new Error(
      `Your node_modules is stale. Please run \`${installCommand}\` first.`
    )
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
      (err as Error).message ?? 'Unknown error in stale-dep.'
    )
    process.exit(1)
  }
}
