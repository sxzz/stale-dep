import process from 'node:process'
import { defineNuxtModule } from '@nuxt/kit'
import { consola } from 'consola'
import { check, getPackageManager, PROJECT_NAME, type PackageManager } from '.'
import type {} from '@nuxt/schema'

// eslint-disable-next-line import/no-default-export
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
    } catch (error: any) {
      if (opts.warn)
        consola.warn(
          `[${PROJECT_NAME}]`,
          (error as Error).message ?? `Unknown error in ${PROJECT_NAME}.`,
        )
    }
  },
})
