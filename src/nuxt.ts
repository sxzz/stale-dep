import { defineNuxtModule } from '@nuxt/kit'
import { PROJECT_NAME, check, getPackageManager } from '.'
import type { PackageManager } from '.'
import type {} from '@nuxt/schema'
import { consola } from 'consola'

export default defineNuxtModule<{
  enabled?: boolean
  packageManager?: PackageManager
  warn?: boolean
}>({
  meta: {
    name: 'stale-dep',
    configKey: 'staleDep',
  },
  defaults: {
    enabled: process.env.NODE_ENV !== 'test',
    warn: false,
  },
  async setup(opts) {
    if (!opts.enabled) return

    try {
      await check(opts.packageManager || (await getPackageManager()))
    } catch (err: any) {
      if (opts.warn)
        consola.warn(
          `[${PROJECT_NAME}]`,
          (err as Error).message ?? `Unknown error in ${PROJECT_NAME}.`
        )
    }
  },
})
