import { program } from 'commander'
import consola from 'consola'
import { PROJECT_NAME } from './constant'
import { check, update } from './command'
import { getPackageManager } from '.'

program.option('-u, --update')
program.parse(process.argv)

const options = program.opts<{
  update: boolean
}>()
run()

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
