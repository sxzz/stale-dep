import process from 'node:process'
import cac from 'cac'
import consola from 'consola'
import { detect, type AgentName } from 'package-manager-detector'
import { version } from '../package.json'
import { check, update } from './command'
import { PROJECT_NAME } from './constant'

const cli = cac(PROJECT_NAME)
cli.help().version(version)

cli
  .option(
    '-p, --packageManager <packageManager>',
    `specific package manager, available options: npm, yarn, pnpm, bun, deno`,
  )
  .option('-u, --update', 'Update stale dependencies', { default: false })
  .option('-w, --warn', 'Show warning messages instead of errors', {
    default: false,
  })
  .command('', 'Check stale dependencies')
  .action(run)
cli.parse()

async function run(args: {
  packageManager?: AgentName
  update: boolean
  warn: boolean
}) {
  try {
    const pm = args.packageManager || (await detect())?.name
    if (!pm) throw new Error('No package manager detected.')

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
