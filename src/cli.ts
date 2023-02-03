import cac from 'cac'
import consola from 'consola'
import { PROJECT_NAME } from './constant'
import { check, update } from './command'
import { getPackageManager } from '.'

const cli = cac('stale-dep')

cli.option('-u, --update', 'Update stale dependencies', { default: false })
const options = cli.parse()

run()

async function run() {
  try {
    const pm = await getPackageManager()
    if (options.options.update) {
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
