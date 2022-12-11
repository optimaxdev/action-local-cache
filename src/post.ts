import { setFailed } from '@actions/core'
import { mkdirP, mv } from '@actions/io'

import { getVars } from './lib/getVars'
import { isErrorLike } from './lib/isErrorLike'
import log from './lib/log'

async function post(): Promise<void> {
  try {
    const { cacheDir, targetPath, cachePath } = getVars()
    log.info(
      `Target file/folder \n path: '${targetPath}' \n Will be saved to \n path: '${cachePath}' \n CWD: '${process.cwd()}'`
    )
    await mkdirP(cacheDir)

    await mv(targetPath, cachePath, { force: true })
  } catch (error: unknown) {
    log.trace(error)
    setFailed(isErrorLike(error) ? error.message : `unknown error: ${error}`)
  }
}

void post()
