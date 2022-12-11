import { exec } from 'child_process'
import log from './log'
import type { WaitForOptions } from './waitFor'
import { waitFor } from './waitFor'

export async function lsofIsFileInUseCheck(filePath: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    exec(`lsof ${filePath}`, (res) => {
      if (!res || !res.code) {
        throw new Error('Something went wrong')
      }

      if (res.code === 1) {
        resolve(false)
      }

      resolve(true)
    })
  })
}

const defaultOptions: WaitForOptions = {
  interval: 5000,
  timeout: 30000,
}

export async function waitForFileNotToBeInUse(
  filePath: string,
  options?: WaitForOptions
): Promise<void> {
  const optionsWithDefaults = { ...defaultOptions, ...options }

  log.info(`Checking if file "${filePath}" is in use`)
  await waitFor(async () => {
    const isInUse = await lsofIsFileInUseCheck(filePath)
    if (!isInUse) {
      log.info(`File "${filePath}" not in use, continuing...`)
      return true
    }

    log.info(`File "${filePath}" still in use, waiting another '${defaultOptions.interval}'ms`)
    return false
  }, optionsWithDefaults)
}
