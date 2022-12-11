import { timeout } from './timeout'

type FunctionToWaitFor<T> = () => Promise<T> | T

export type WaitForOptions = {
  timeout?: number
  interval?: number
}

const isNotEmptyArray = (result: unknown): boolean =>
  Array.isArray(result) && Boolean(result.length)
const notArrayAndTruthy = (result: unknown): boolean => !Array.isArray(result) && Boolean(result)

export const waitFor = async <T>(
  func: FunctionToWaitFor<T>,
  options?: WaitForOptions
): Promise<T> => {
  const endTime = Date.now() + (options?.timeout ?? 10000)

  while (Date.now() < endTime) {
    const result = await func()
    if (isNotEmptyArray(result) || notArrayAndTruthy(result)) {
      return result
    }
    await timeout(options?.interval ?? 1000)
  }

  throw new Error('Timed out.')
}
