import process from 'node:process'
import cac from 'cac'
import consola from 'consola'
import { version } from '../package.json'
import { check, update } from './command'
import { PROJECT_NAME, type PackageManager } from './constant'
import { getPackageManager } from '.'

const cli = cac(PROJECT_NAME)
cli.help().version(version)

cli
  .option('-p, --packageManager <packageManager>', 'specific package manager')
  .option('-u, --update', 'Update stale dependencies', { default: false })
  .option('-w, --warn', 'Show warning messages instead of errors', {
    default: false,
  })
  .command('', 'Check stale dependencies')
  .action(run)
cli.parse()

async function run(args: {
  packageManager?: PackageManager
  update: boolean
  warn: boolean
}) {
  try {
    const pm = args.packageManager || (await getPackageManager())
    if (args.update) {
      await update(pm)
    } else {
      await check(pm)
    }
  } catch (error) {
    consola[args.warn ? 'warn' : 'error'](
      `[${PROJECT_NAME}]`,
      (error as Error).message ?? `Unknown error in ${PROJECT_NAME}.`,
    )
    if (!args.warn) process.exit(1)
  }
}
