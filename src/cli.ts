import process from 'node:process'
import cac from 'cac'
import consola from 'consola'
import { check, update } from './command'
import { PROJECT_NAME } from './constant'
import { getPackageManager } from '.'

const cli = cac('stale-dep')

cli.option('-p, --packageManager <packageManager>', 'specific package manager')
cli.option('-u, --update', 'Update stale dependencies', { default: false })
cli.option('-w, --warn', 'Show warning messages instead of errors', {
  default: false,
})
const argv = cli.parse()

run()

async function run() {
  try {
    const pm = argv.options.packageManager || (await getPackageManager())
    if (argv.options.update) {
      await update(pm)
    } else {
      await check(pm)
    }
  } catch (error) {
    consola[argv.options.warn ? 'warn' : 'error'](
      `[${PROJECT_NAME}]`,
      (error as Error).message ?? `Unknown error in ${PROJECT_NAME}.`,
    )
    if (!argv.options.warn) process.exit(1)
  }
}
