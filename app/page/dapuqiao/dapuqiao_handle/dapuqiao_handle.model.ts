import { GarbageDropEventRecord } from '../../../data-core/model/waste-regulation/event-record'
import { GarbageStation } from '../../../data-core/model/waste-regulation/garbage-station'

export class DaPuQiaoHandleArgs {
  date: Date = new Date()
  isHandle: boolean = false
  isFeedback: boolean = false
  name?: string
}

export class DaPuQiaoHandleModel extends GarbageDropEventRecord {
  GarbageStation!: Promise<GarbageStation>
  LevelTime!: Date
  Distance?: Promise<string>
  Minutes?: number
}
