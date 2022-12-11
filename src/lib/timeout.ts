export const timeout = async (ms: number): Promise<void> =>
  new Promise(
    (resolve): NodeJS.Timeout =>
      setTimeout(() => {
        resolve()
      }, ms)
  )
