export function wait(
  whether: () => boolean,
  reject: () => void,
  timepoll?: number
): void
export function wait(
  whether: () => boolean,
  timepoll?: number,
  timeout?: number
): Promise<void>
export function wait(
  whether: () => boolean,
  args1: (() => void) | number = 100,
  args2: number = 1000 * 2
) {
  if (typeof args1 === 'number') {
    return wait2(whether, args1, args2)
  } else {
    return wait1(whether, args1, args2)
  }
}

function wait1(whether: () => boolean, reject: () => void, timepoll = 100) {
  setTimeout(() => {
    if (whether()) {
      reject()
    } else {
      wait(whether, reject, timepoll)
    }
  }, timepoll)
}
function wait2(whether: () => boolean, timepoll = 100, timeout = 1000 * 2) {
  return new Promise<void>((resolve, reject) => {
    let stop = false
    wait(
      () => {
        return whether() || stop
      },
      () => {
        resolve()
      },
      timepoll
    )
    setTimeout(() => {
      stop = true
      reject()
    }, timeout)
  })
}
