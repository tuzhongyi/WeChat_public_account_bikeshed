import { dateFormat } from '../../../common/tool'
import {
  IntervalParams,
  PagedList,
  TimeUnit,
} from '../../../data-core/model/page'
import {
  GetUserLabelsParams,
  UserLabel,
  UserLabelType,
} from '../../../data-core/model/user-stystem'
import {
  EventNumber,
  EventType,
} from '../../../data-core/model/waste-regulation/event-number'
import {
  GarbageDropEventRecord,
  GarbageFullEventRecord,
  IllegalDropEventRecord,
  MixedIntoEventRecord,
  SmokeEventRecord,
} from '../../../data-core/model/waste-regulation/event-record'
import {
  GarbageDropProcessParams,
  GetEventRecordsParams,
  GetGarbageDropEventRecordsParams,
} from '../../../data-core/model/waste-regulation/event-record-params'
import {
  GarbageStationGarbageCountStatistic,
  GarbageStationNumberStatisticV2,
  GetGarbageStationStatisticNumbersParams,
  GetGarbageStationStatisticNumbersParamsV2,
} from '../../../data-core/model/waste-regulation/garbage-station-number-statistic'
import { VideoUrl } from '../../../data-core/model/waste-regulation/video-model'
import { ResourceRole, WeChatUser } from '../../../data-core/model/we-chat'
import { Service } from '../../../data-core/repuest/service'
import { Duration } from '../tools/datetime.tool'
import { DataCache } from './Cache'
import { IUserLabelController, Paged, StatisticNumber } from './IController'
import { IDataController } from './modules/IController/IDataController'
import { IDetailsEvent } from './modules/IController/IDetailsEvent'
import { IEventHistory } from './modules/IController/IEventHistory'
import { IGarbageDrop } from './modules/IController/IGarbageDrop'
import { IGarbageStationController } from './modules/IController/IGarbageStationController'
import { IGarbageStationNumberStatistic } from './modules/IController/IGarbageStationNumberStatistic'
import { IUserPushManager } from './modules/IController/IUserPushManager'
import { ViewModelConverter } from './ViewModelConverter'
import {
  CameraViewModel,
  GarbageStationViewModel,
  IPictureController,
} from './ViewModels'

export abstract class DataController
  implements
    IDataController,
    IGarbageStationController,
    IEventHistory,
    IDetailsEvent,
    IGarbageStationNumberStatistic,
    IGarbageDrop,
    IUserPushManager
{
  static readonly defaultImageUrl =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABIAAAAKIAQAAAAAgULygAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAd2KE6QAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAHdElNRQflAgIBCxpFwPH8AAAAcklEQVR42u3BMQEAAADCoPVPbQZ/oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+A28XAAEDwmj2AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAyLTAyVDAxOjExOjI2KzAwOjAwOo9+nAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMi0wMlQwMToxMToyNiswMDowMEvSxiAAAAAASUVORK5CYII='

  constructor(protected service: Service, roles: ResourceRole[]) {
    this.roles = roles
  }
  async Process(eventId: string, userId: string, description: string) {
    let user = await this.GetUser(userId)
    let params: GarbageDropProcessParams = {
      ProcessorId: user.Id ?? '',
      ProcessorName: user.FirstName ?? '' + user.LastName ?? '',
      ProcessorMobileNo: user.MobileNo ?? '',
      ProcessDescription: description,
    }
    return this.service.event.record.garbageDrop.process(eventId, params)
  }

  userLabel: IUserLabelController = {
    get: (garbageStationId: string) => {
      return this.service.user.label.get(
        garbageStationId,
        UserLabelType.garbageStation
      )
    },
    create: async (garbageStationId: string, name: string, number: string) => {
      let label = new UserLabel()
      label.LabelId = garbageStationId
      label.LabelName = name
      label.CreateTime = new Date()
      label.UpdateTime = new Date()
      label.LabelType = UserLabelType.garbageStation
      label.Content = number
      let result = await this.service.user.label.post(
        garbageStationId,
        label.LabelType,
        label
      )
      return result.FaultCode == 0
    },
    update: (garbageStationId: string, name: string, number: string) => {
      let promise = this.userLabel.get(
        garbageStationId,
        UserLabelType.garbageStation
      )
      return promise.then(async (x) => {
        x.Content = number
        x.LabelName = name
        x.UpdateTime = new Date()
        let result = await this.service.user.label.put(
          garbageStationId,
          x.LabelType,
          x
        )
        return result.FaultCode == 0
      })
    },
    remove: async (id: string) => {
      let result = await this.service.user.label.delete(
        id,
        UserLabelType.garbageStation
      )
      return result.FaultCode == 0
    },
    list: (labelIds?: string[]) => {
      let params = new GetUserLabelsParams()
      params.LabelIds = labelIds
      return this.service.user.label.getList(params)
    },
  }

  picture: IPictureController = {
    post: async (data: string) => {
      return this.service.picture(data)
    },
    get: (id: string) => {
      return this.getImageUrl(id) as string
    },
  }

  GetUser(id: string): Promise<WeChatUser> {
    return this.service.wechat.get(id)
  }
  SetUser(user: WeChatUser): void {
    this.service.wechat.set(user)
  }

  isToday(date: Date) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dataDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    )
    return dataDate.getTime() - today.getTime() >= 0
  }

  getToday(): IntervalParams {
    const now = new Date()
    const begin = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    )
    return {
      BeginTime: begin,
      EndTime: end,
    }
  }

  roles: ResourceRole[]

  abstract getGarbageStationList: () => Promise<GarbageStationViewModel[]>
  async getGarbageStation(id: string) {
    let item = await this.service.garbageStation.get(id)
    let result = ViewModelConverter.Convert(this.service, item)
    return result
  }
  abstract getResourceRoleList: () => Promise<ResourceRole[]>
  getEventCount = async (day: Duration) => {
    let result: StatisticNumber = {
      id: '',
      name: '',
      illegalDropNumber: 0,
      mixedIntoNumber: 0,
      garbageFullNumber: 0,
      garbageDropNumber: 0,
    }
    let list = await this.getStatisticNumberList(day)

    list.forEach((x) => {
      result.illegalDropNumber += x.illegalDropNumber
      result.mixedIntoNumber += x.mixedIntoNumber
      result.garbageFullNumber += x.garbageFullNumber
      result.garbageDropNumber += x.garbageDropNumber
    })
    return result
  }
  abstract getGarbageStationStatisticNumberListInToday: (
    sources: ResourceRole[]
  ) => Promise<Array<StatisticNumber>>
  abstract getStatisticNumberListInToday(
    sources: ResourceRole[]
  ): Promise<Array<StatisticNumber>>
  abstract getStatisticNumberListInOtherDay(
    day: Duration,
    sources: ResourceRole[]
  ): Promise<Array<StatisticNumber>>
  getStatisticNumberList = async (
    day: Duration
  ): Promise<Array<StatisticNumber>> => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dataDate = new Date(
      day.begin.getFullYear(),
      day.begin.getMonth(),
      day.begin.getDate()
    )

    let roles = await this.getResourceRoleList()

    if (dataDate.getTime() - today.getTime() >= 0) {
      return this.getStatisticNumberListInToday(roles)
    } else {
      return this.getStatisticNumberListInOtherDay(day, roles)
    }
  }

  abstract getHistory(day: Duration): Promise<
    | EventNumber[]
    | {
        IllegalDrop: Array<EventNumber>
        MixedInto: Array<EventNumber>
      }
  >

  getDivision = async (divisionId: string) => {
    let item = await this.service.division.get(divisionId)
    return ViewModelConverter.Convert(this.service, item)
  }
  getCameraList = async (
    garbageStationId: string,
    loadImage: (cameraId: string, url?: string) => void
  ) => {
    if (DataCache.Cameras[garbageStationId]) {
      return DataCache.Cameras[garbageStationId]
    }
    let promise = await this.service.camera.list(garbageStationId)
    const result = promise
      .sort((a, b) => {
        return a.CameraUsage - b.CameraUsage || a.Name.localeCompare(b.Name)
      })
      .map((x) => {
        let vm = ViewModelConverter.Convert(this.service, x)
        return vm
      })
    DataCache.Cameras[garbageStationId] = result
    return DataCache.Cameras[garbageStationId]
  }
  getImageUrlBySingle = (id: string) => {
    return this.service.picture(id)
  }
  getImageUrlByArray = (ids: string[]) => {
    const array = []
    for (let i = 0; i < ids.length; i++) {
      const url = this.getImageUrlBySingle(ids[i])
      array.push(url)
    }
    return array
  }
  getImageUrl(id: string): string | undefined
  getImageUrl(id: string[]): Array<string | undefined> | undefined
  getImageUrl(
    id: string | string[]
  ): string | Array<string | undefined> | undefined {
    if (Array.isArray(id)) {
      return this.getImageUrlByArray(id)
    } else if (typeof id == 'string') {
      return this.getImageUrlBySingle(id)
    } else {
    }
  }

  getVodUrl(cameraId: string, begin: Date, end: Date): Promise<VideoUrl> {
    return this.service.sr.VodUrls({
      CameraId: cameraId,
      StreamType: 1,
      Protocol: 'ws-ps',
      BeginTime: begin.toISOString(),
      EndTime: end.toISOString(),
    })
  }

  getLiveUrl(cameraId: string): Promise<VideoUrl> {
    return this.service.sr.PreviewUrls({
      CameraId: cameraId,
      StreamType: 1,
      Protocol: 'ws-ps',
    })
  }

  getGarbageStationEventCount = async (garbageStationIds: string[]) => {
    let params = new GetGarbageStationStatisticNumbersParams()
    params.Ids = garbageStationIds
    const promise = await this.service.garbageStation.statisticNumberList(
      params
    )
    return promise.Data.map((x) => {
      let result: StatisticNumber = {
        id: x.Id,
        name: x.Name,
        illegalDropNumber: 0,
        mixedIntoNumber: 0,
        garbageFullNumber: 0,
        garbageDropNumber: x.GarbageDropStationNumber ?? 0,
      }

      if (x.TodayEventNumbers) {
        let illegalDropNumber = x.TodayEventNumbers.find(
          (y) => y.EventType == EventType.IllegalDrop
        )
        if (illegalDropNumber)
          result.illegalDropNumber = illegalDropNumber.DayNumber
        let mixedIntoNumber = x.TodayEventNumbers.find(
          (y) => y.EventType == EventType.MixedInto
        )
        if (mixedIntoNumber) {
          result.mixedIntoNumber = mixedIntoNumber.DayNumber
        }
        let garbageFullNumber = x.TodayEventNumbers.find(
          (y) => y.EventType == EventType.GarbageFull
        )
        if (garbageFullNumber) {
          result.garbageFullNumber = garbageFullNumber.DayNumber
        }
      }
      return result
    })
  }

  getEventListParams(
    day: Duration,
    page: Paged,
    type?: EventType,
    ids?: string[]
  ) {
    let params = new GetEventRecordsParams()
    params.BeginTime = day.begin
    params.EndTime = day.end
    params.PageSize = page.size
    params.PageIndex = page.index
    params.Desc = true
    params.ResourceIds = this.roles.map((x) => x.Id)
    if (ids) {
      params.ResourceIds = ids
    }
    return params
  }

  async getEventListByParams(type: EventType, params: GetEventRecordsParams) {
    let promise: PagedList<
      | IllegalDropEventRecord
      | MixedIntoEventRecord
      | GarbageFullEventRecord
      | SmokeEventRecord
    >

    switch (type) {
      case EventType.IllegalDrop:
        promise = await this.service.event.record.illegalDrop.list(params)
        break
      case EventType.MixedInto:
        promise = await this.service.event.record.mixedInto.list(params)
        break
      case EventType.GarbageFull:
        promise = await this.service.event.record.garbageFull.list(params)
        let records = new Array<GarbageFullEventRecord>()
        promise.Data.forEach((record) => {
          if (record instanceof GarbageFullEventRecord) {
            if (record.Data.CameraImageUrls) {
              record.Data.CameraImageUrls = record.Data.CameraImageUrls.sort(
                (a, b) => {
                  if (a.CameraName && b.CameraName)
                    return (
                      a.CameraName.length - b.CameraName.length ||
                      a.CameraName.localeCompare(b.CameraName)
                    )
                  return 0
                }
              )
            }
            records.push(record)
          }
        })
        promise.Data = records
        break
      case EventType.GarbageDrop:
        ;(params as GetGarbageDropEventRecordsParams).IsHandle = false
        ;(params as GetGarbageDropEventRecordsParams).IsTimeout = false
        promise = await this.service.event.record.garbageDrop.list(params)
        break
      case EventType.GarbageDropHandle:
        ;(params as GetGarbageDropEventRecordsParams).IsHandle = true
        ;(params as GetGarbageDropEventRecordsParams).IsTimeout = false
        promise = await this.service.event.record.garbageDrop.list(params)
        break
      case EventType.GarbageDropTimeout:
        ;(params as GetGarbageDropEventRecordsParams).IsHandle = false
        ;(params as GetGarbageDropEventRecordsParams).IsTimeout = true
        promise = await this.service.event.record.garbageDrop.list(params)
        break
      case EventType.GarbageDropAll:
        promise = await this.service.event.record.garbageDrop.list(params)
        break
      case EventType.Smoke:
        promise = await this.service.event.record.smoke.list(params)
        break
      default:
        return undefined
    }

    return promise
  }

  getEventList = async (
    day: Duration,
    page: Paged,
    type: EventType,
    ids?: string[]
  ) => {
    let params = this.getEventListParams(day, page, type, ids)

    return this.getEventListByParams(type, params)
  }

  async GetEventRecordById(type: EventType, eventId: string) {
    let response:
      | IllegalDropEventRecord
      | MixedIntoEventRecord
      | GarbageFullEventRecord
      | GarbageDropEventRecord
      | SmokeEventRecord
    switch (type) {
      case EventType.IllegalDrop:
        response = await this.service.event.record.illegalDrop.get(eventId)
        break
      case EventType.GarbageFull:
        response = await this.service.event.record.garbageFull.get(eventId)
        let record = response as GarbageFullEventRecord
        if (record.Data.CameraImageUrls) {
          ;(response as GarbageFullEventRecord).Data.CameraImageUrls =
            record.Data.CameraImageUrls.sort((a, b) => {
              if (a.CameraName && b.CameraName)
                return (
                  a.CameraName.length - b.CameraName.length ||
                  a.CameraName.localeCompare(b.CameraName)
                )
              return 0
            })
        }
        break
      case EventType.MixedInto:
        response = await this.service.event.record.mixedInto.get(eventId)
        break
      case EventType.GarbageDrop:
      case EventType.GarbageDropHandle:
      case EventType.GarbageDropTimeout:
        response = await this.service.event.record.garbageDrop.get(eventId)
        break
      case EventType.Smoke:
        response = await this.service.event.record.smoke.get(eventId)
        break
      default:
        return undefined
    }
    return response
  }

  GetEventRecord(
    type: EventType,
    eventId: string
  ): Promise<
    | IllegalDropEventRecord
    | MixedIntoEventRecord
    | GarbageFullEventRecord
    | SmokeEventRecord
    | undefined
  >
  GetEventRecord(
    type: EventType,
    index: number,
    day?: Duration,
    sourceIds?: string[]
  ): Promise<
    | IllegalDropEventRecord
    | MixedIntoEventRecord
    | GarbageFullEventRecord
    | SmokeEventRecord
    | undefined
  >
  async GetEventRecord(
    type: EventType,
    index: string | number,
    day?: Duration,
    sourceIds?: string[]
  ) {
    if (typeof index === 'string') {
      return await this.GetEventRecordById(type, index)
    } else if (typeof index === 'number') {
      if (!day) {
        throw new Error('please choose one day')
      }
      let paged: Paged = { index: index, size: 1 }
      let ids: undefined | string[] = undefined
      if (sourceIds && sourceIds.length > 0) {
        ids = sourceIds
      }
      let result = await this.getEventList(day, paged, type, ids)
      if (result) {
        return result.Data[0]
      }
    } else {
      throw new Error('can not read index or eventId')
    }
  }

  async GetEventRecordByGarbageStation(
    garbageStationId: string,
    paged: Paged,
    type?: EventType,
    day: Duration = { begin: new Date(), end: new Date() }
  ): Promise<
    | PagedList<
        | IllegalDropEventRecord
        | MixedIntoEventRecord
        | GarbageFullEventRecord
        | GarbageDropEventRecord
      >
    | undefined
  > {
    let params = this.getEventListParams(day, paged, type)
    params.DivisionIds = undefined
    params.ResourceIds = undefined
    params.StationIds = [garbageStationId]
    if (type) {
      switch (type) {
        case EventType.GarbageDrop:
          ;(params as GetGarbageDropEventRecordsParams).IsTimeout = false
          ;(params as GetGarbageDropEventRecordsParams).IsHandle = false
          return await this.service.event.record.garbageDrop.list(params)
        case EventType.GarbageDropTimeout:
          ;(params as GetGarbageDropEventRecordsParams).IsTimeout = true
          ;(params as GetGarbageDropEventRecordsParams).IsHandle = false
          return await this.service.event.record.garbageDrop.list(params)
        case EventType.GarbageDropHandle:
          ;(params as GetGarbageDropEventRecordsParams).IsHandle = true
          ;(params as GetGarbageDropEventRecordsParams).IsTimeout = false
          return await this.service.event.record.garbageDrop.list(params)

        default:
          return this.getEventListByParams(type, params)
      }
    } else {
      return await this.service.event.record.garbageDrop.list(params)
    }
  }

  async GetCamera(
    garbageStationId: string,
    cameraId: string
  ): Promise<CameraViewModel> {
    let x = await this.service.camera.get(garbageStationId, cameraId)
    let vm = ViewModelConverter.Convert(this.service, x)
    return vm
  }

  async getGarbageStationNumberStatisticList(
    ids: string[],
    day: Duration
  ): Promise<GarbageStationNumberStatisticV2[]> {
    let params: GetGarbageStationStatisticNumbersParamsV2 = {
      BeginTime: day.begin,
      EndTime: day.end,
      GarbageStationIds: ids,
      TimeUnit: TimeUnit.Day,
    }
    let response = await this.service.garbageStation.statisticNumberHistoryList(
      params
    )
    return response
  }

  /**
   * 获取垃圾厢房数据统计
   *
   * @param {string} id 垃圾厢房ID
   * @param {OneDay} day 日期
   * @returns {Promise<GarbageStationNumberStatisticV2[]>}
   * @memberof DataController
   */
  async getGarbageStationNumberStatistic(
    id: string,
    date: Date
  ): Promise<GarbageStationGarbageCountStatistic[]> {
    let response = this.service.garbageStation.statisticGarbageCountHistoryList(
      {
        Date: dateFormat(date, 'yyyy-MM-dd'),
        GarbageStationIds: [id],
      }
    )
    return response
  }
  async getGarbageDropEventList(
    day: Duration,
    page: Paged,
    type?: EventType,
    ids?: string[]
  ): Promise<PagedList<GarbageDropEventRecord>> {
    let params: GetGarbageDropEventRecordsParams = this.getEventListParams(
      day,
      page,
      type,
      ids
    )
    if (type) {
      switch (type) {
        case EventType.GarbageDrop:
          params.IsTimeout = false
          params.IsHandle = false
          break
        case EventType.GarbageDropTimeout:
          params.IsTimeout = true
          params.IsHandle = false
          break
        case EventType.GarbageDropHandle:
          params.IsHandle = true
          params.IsTimeout = false
          break

        default:
          break
      }
    }
    return await this.service.event.record.garbageDrop.list(params)
  }
}
