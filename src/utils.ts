import { readFile } from 'node:fs/promises'
import { LOCKS, type AgentName } from 'package-manager-detector'

export function getLockfiles(om: AgentName): string[] {
  return Object.entries(LOCKS)
    .filter(([, agent]) => agent === om)
    .map(([lockfileName]) => lockfileName)
}

export function tryRead(filename: string): Promise<string | undefined> {
  return readFile(filename, 'utf8').then(
    (r) => r.trim(),
    () => undefined,
  )
}
