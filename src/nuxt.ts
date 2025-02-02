import process from 'node:process'
import { defineNuxtModule } from '@nuxt/kit'
import consola from 'consola'
import { detect, type AgentName } from 'package-manager-detector'
import { check } from './command'
import { PROJECT_NAME } from './constant'
import type { NuxtModule } from '@nuxt/schema'

export interface Options {
  enabled?: boolean
  packageManager?: AgentName
  warn?: boolean
}

const module: NuxtModule<Options> = defineNuxtModule<Options>({
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
      const pm = opts.packageManager || (await detect())?.name
      if (!pm) throw new Error('No package manager detected.')

      await check(pm)
    } catch (error: any) {
      if (opts.warn)
        consola.warn(
          `[${PROJECT_NAME}]`,
          (error as Error).message ?? `Unknown error in ${PROJECT_NAME}.`,
        )
      else {
        throw error
      }
    }
  },
})

// eslint-disable-next-line import/no-default-export
export default module
