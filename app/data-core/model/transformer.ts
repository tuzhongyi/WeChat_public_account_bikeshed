import { TransformationType, TransformFnParams } from 'class-transformer'

export function transformDateTime(params: TransformFnParams) {
  if (params.type === TransformationType.PLAIN_TO_CLASS) {
    if (
      params.value &&
      (params.value instanceof Date || !!params.value.getTime)
    ) {
      return new Date(params.value.getTime())
    } else {
      return new Date(params.value)
    }
  } else if (params.type === TransformationType.CLASS_TO_PLAIN) {
    let date = params.value as Date
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
      .getSeconds()
      .toString()
      .padStart(2, '0')}.${date.getMilliseconds()}${
      date.getTimezoneOffset() < 0 ? '+' : '-'
    }${Math.abs(date.getTimezoneOffset() / 60)
      .toString()
      .padStart(2, '0')}:${Math.abs(date.getTimezoneOffset() % 60)
      .toString()
      .padStart(2, '0')}`
    return (params.value as Date).toISOString()
  } else if (params.type === TransformationType.CLASS_TO_CLASS) {
    return new Date(params.value)
  }
}
