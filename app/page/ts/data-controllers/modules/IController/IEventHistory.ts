import { PagedList } from '../../../../../data-core/model/page'
import { EventType } from '../../../../../data-core/model/waste-regulation/event-number'
import {
  GarbageDropEventRecord,
  GarbageFullEventRecord,
  IllegalDropEventRecord,
  MixedIntoEventRecord,
  SmokeEventRecord,
} from '../../../../../data-core/model/waste-regulation/event-record'
import { Duration } from '../../../tools/datetime.tool'
import { IImage, IResourceRoleList, IVodUrl, Paged } from '../../IController'

export interface IEventHistory extends IResourceRoleList, IImage, IVodUrl {
  /**
   * 获取事件列表
   *
   * @param {Duration} day 哪一天
   * @param {Paged} page 分页
   * @param {EventType} type 事件类型
   * @param {string[]} [ids]
   * @returns {(Promise<PagedList<IllegalDropEventRecord | MixedIntoEventRecord | GarbageFullEventRecord | SmokeEventRecord> | undefined>)}
   * @memberof IEventHistory
   */
  getEventList(
    day: Duration,
    page: Paged,
    type: EventType,
    ids?: string[]
  ): Promise<
    | PagedList<
        | IllegalDropEventRecord
        | MixedIntoEventRecord
        | GarbageFullEventRecord
        | GarbageDropEventRecord
        | SmokeEventRecord
      >
    | undefined
  >
}
