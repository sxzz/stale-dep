import { detect } from 'package-manager-detector'
import { expect, test } from 'vitest'
import { checkHash, checkMtime } from '../src'

const pm = (await detect())!.name

test('detect package manager', () => {
  expect(pm).toBe('pnpm')
})

test('checkHash', async () => {
  expect(await checkHash(pm)).toBe(true)
})

test('checkMtime', async () => {
  expect(await checkMtime(pm)).toBe(true)
})
