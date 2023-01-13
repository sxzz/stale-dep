import { expect, test } from 'vitest'
import { checkHash, checkModifyTimeStamps, getPackageManager } from '../src'

test('getPackageManager', async () => {
  expect(await getPackageManager()).toBe('pnpm')
})

test('checkHash', async () => {
  const pm = await getPackageManager()
  expect(await checkHash(pm)).toBe(true)
})

test('checkModifyTimeStamps', async () => {
  const pm = await getPackageManager()
  expect(await checkModifyTimeStamps(pm)).toBe(true)
})
