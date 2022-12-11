import * as fs from 'fs/promises'
import { rmRF } from '@actions/io'
import path from 'path'

type CacheVersions = {
  current: string
  old: string
}

export async function getCacheVersionsDirectoryNames(cacheDir: string): Promise<CacheVersions> {
  const caches = await fs.readdir(cacheDir)

  // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
  const [old, current] = caches.sort()

  return { old, current }
}

export function getNewCacheDirectoryName(): string {
  const now = new Date()
  const currentTime = now.toISOString()
  return currentTime
}

export async function deleteOldestCache(cacheDir: string): Promise<void> {
  const oldestCacheDir = (await getCacheVersionsDirectoryNames(cacheDir)).old
  await rmRF(path.join(cacheDir, oldestCacheDir))
}
