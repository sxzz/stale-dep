import { program } from 'commander'
import consola from 'consola'
import { calcHash, checkHash, getPackageManager, storeHash } from '.'

program.option('-u, --update')
program.parse(process.argv)

const options = program.opts<{ update: boolean }>()
run()

async function run() {
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
    consola.error(
      `Stale node_modules detected, please run \`${installCommand}\``
    )
    process.exit(1)
  }
}
