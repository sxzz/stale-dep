import { defineNuxtModule } from '@nuxt/kit'
import { check, getPackageManager } from '.'
import type { PackageManager } from '.'
import type {} from '@nuxt/schema'

export default defineNuxtModule<{
  enabled?: boolean
  packageManager?: PackageManager
}>({
  meta: {
    name: 'stale-dep',
    configKey: 'staleDep',
  },
  defaults: {
    enabled: process.env.NODE_ENV !== 'test',
  },
  async setup(opts) {
    if (opts.enabled) {
      await check(opts.packageManager || (await getPackageManager()))
    }
  },
})
