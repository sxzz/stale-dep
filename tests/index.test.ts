import { expect, test } from 'vitest'
import { checkHash, checkMtime, getPackageManager } from '../src'

test('getPackageManager', async () => {
  expect(await getPackageManager()).toBe('pnpm')
})

test('checkHash', async () => {
  const pm = await getPackageManager()
  expect(await checkHash(pm)).toBe(true)
})

test('checkMtime', async () => {
  const pm = await getPackageManager()
  expect(await checkMtime(pm)).toBe(true)
})
