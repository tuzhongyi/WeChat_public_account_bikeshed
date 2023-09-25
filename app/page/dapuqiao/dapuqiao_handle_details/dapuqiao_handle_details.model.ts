import { GarbageDropEventRecord } from '../../../data-core/model/waste-regulation/event-record'
import { GarbageDropFeedback } from '../../../data-core/model/waste-regulation/garbage-drop-feedback.model'
import { GarbageStation } from '../../../data-core/model/waste-regulation/garbage-station'

export enum DaPuQiaoHandleDetailsCommand {
  ondetails = 'OnDaPuQiaoHandleDetails',
}
export class DaPuQiaoHandleDetailsModel extends GarbageDropEventRecord {
  GarbageStation!: Promise<GarbageStation>
  Minutes?: number
  Feedback?: GarbageDropFeedback
  Images: Promise<IDaPuQiaoHandleDetailsImage>[] = []
  Distance!: Promise<number | undefined>
}

export interface IDaPuQiaoHandleDetailsImage {
  id: string
  data: string
}
