import { program } from 'commander'
import consola from 'consola'
import { PROJECT_NAME } from './constant'
import { calcHash, checkHash, getPackageManager, storeHash } from '.'

program.option('-u, --update')
program.parse(process.argv)

const options = program.opts<{ update: boolean }>()
run()

async function run() {
  try {
    const packageManager = await getPackageManager()
    if (options.update) {
      await storeHash(await calcHash(packageManager))
      consola.success('Successfully store the dependency hash')
    } else if (!(await checkHash(packageManager))) {
      const installCommand = {
        npm: 'npm install',
        yarn: 'yarn',
        pnpm: 'pnpm i',
        'pnpm@6': 'pnpm i',
        bun: 'bun install',
      }[packageManager]
      throw new Error(
        `Your node_modules is stale. Please run \`${installCommand}\` first.`
      )
    }
  } catch (err) {
    consola.error(
      `[${PROJECT_NAME}]`,
      (err as Error).message ?? 'Unknown error in stale-dep.'
    )
    process.exit(1)
  }
}
