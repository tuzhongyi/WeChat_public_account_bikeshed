import { TrashCan } from './trashCan'
import { Camera } from './camera'
import { PagedParams } from '../page'
import { __values } from 'tslib'
import { ResponseData } from '../response-data'
import { Member } from '../we-chat'

export enum StationState {
  // 正常
  Normal = 0,
  // 满溢
  Full = 1,
  // 异常
  Error = 2,
}

export interface IFlags extends NumberConstructor {
  Value: number[]
}

export class Flags<T extends number | string> {
  value: number | string
  constructor(val: number | string) {
    this.value = val
  }
  getValues(): T[] {
    let result = new Array<T>()
    if (typeof this.value === 'number') {
      let str = this.value.toString(2)

      for (let i = str.length - 1, x = 0; i >= 0; i--, x++) {
        let value = parseInt(str[i])
        if (value) {
          let v = Math.pow(2, x)
          result.push(v as T)
        }
      }
    } else {
      result = this.value.split(',') as T[]
    }
    return result
  }
  contains(t: T) {
    return this.getValues().indexOf(t) >= 0
    // return this.getValues().includes(t)
  }
}

/**投放点信息 */
export class GarbageStation extends ResponseData {
  /**垃圾房ID */
  Id!: string
  /**垃圾房名称 */
  Name!: string
  /**
   * 垃圾房类型(可选)，默认：0
   * 暂时无效，之后会用于高度，形状，室内、室外等区分
   */
  StationType!: number

  /**描述信息(可选) */
  Description?: string
  /**创建时间 */
  CreateTime!: Date | string
  /**更新事件 */
  UpdateTime!: Date | string
  /**GIS点位(可选) */
  GisPoint?: any
  /**所属区划ID(可选) */
  DivisionId?: string
  /**垃圾桶列表(可选) */
  TrashCans?: TrashCan[]
  /**摄像机列表(可选) */
  Cameras?: Camera[]
  /**干垃圾满溢(可选) */
  DryFull?: boolean
  /**干垃圾满溢时间(可选) */
  DryFullTime?: Date | string
  /**干垃圾容积(可选)，单位：L */
  DryVolume?: number
  /**最大干垃圾容积，单位：L */
  MaxDryVolume!: number
  /**湿垃圾满溢(可选) */
  WetFull?: boolean
  /**湿垃圾满溢时间(可选) */
  WetFullTime?: Date | string
  /**湿垃圾容积(可选)，单位：L */
  WetVolume?: number
  /**最大湿垃圾容积，单位：L */
  MaxWetVolume!: number
  private _StationState!: Flags<StationState>
  set StationState(val: number | Flags<StationState>) {
    if (typeof val == 'number') {
      this._StationState = new Flags(val)
    } else {
      this._StationState = val
    }
  }
  // 垃圾厢房状态
  get StationState(): number | Flags<StationState> {
    return this._StationState
  }
  /** 评级 */
  Grade?: number

  /**
   * 计数时间段	O
   *
   * @type {TimeRange[]}
   * @memberof GarbageStation
   */
  CountSchedule?: TimeRange[]
  /**	String	地址	O */
  Address?: string
  /**	Int32	垃圾投放点类型	O */
  DumpPointType?: DumpPointType
  /**	Int32[]	停用的事件号列表	O */
  DisableEventTypes?: number[]
  /**	String	所属网格单元ID	O */
  GridCellId?: string
  /**	GarbageParameters	垃圾相关参数	O */
  GarbageParameters?: GarbageParameters
  /**	Member[]	人员列表	O */
  Members?: Member
  /**	String	IMEI串号	O */
  IMEI?: string
  /**	String	小区名称	O */
  CommunityName?: string
}

export class Time extends Date {
  constructor(val: string) {
    super()
    let items = val.split(':')
    this.setHours(parseInt(items[0]))
    this.setMinutes(parseInt(items[1]))
    this.setSeconds(parseInt(items[2]))
  }
}

export class TimeRange {
  private beginTime?: Time
  set BeginTime(val: Time | string) {
    if (typeof val === 'string') {
      if (val) {
        this.beginTime = new Time(val)
      }
    } else {
      this.beginTime = val
    }
  }
  get BeginTime(): Time | string {
    if (this.beginTime) return this.beginTime
    return ''
  }
  private endTime?: Time
  set EndTime(val: Time | string) {
    if (typeof val === 'string') {
      if (val) {
        this.endTime = new Time(val)
      }
    } else {
      this.endTime = val
    }
  }
  get EndTime(): Time | string {
    if (this.endTime) return this.endTime
    return ''
  }
}

/**获取垃圾房列表参数 */
export class GetGarbageStationsParams extends PagedParams {
  /**垃圾房ID(可选) */
  Ids?: string[]
  /**垃圾房名称(可选)，支持LIKE */
  Name?: string
  /**垃圾房类型(可选) */
  StationType?: number
  /**区划ID(可选) */
  DivisionId?: string
  /**干垃圾是否满溢(可选) */
  DryFull?: boolean
  /**湿垃圾是否满溢(可选) */
  WetFull?: boolean
  /**祖辈ID(可选)，返回该ID下的所有子孙区划及其本身的垃圾房 */
  AncestorId?: string
}

export enum DumpPointType {
  /** 多分类垃圾厢房（干，湿，可回收，有毒有害）	1 */
  multiGarbage = 1,
  /** 多分类露天垃圾投放点（干，湿，可回收，有毒有害）	2 */
  multiOpenGarbage = 2,
  /** 二分类垃圾厢房（干，湿）	3 */
  twoGarbage = 3,
  /** 二分类露天垃圾投放点（干，湿）	4 */
  twoOpenGarbage = 4,
}

export class GarbageParameters {
  /**	Int32	处置超时时长，单位：分钟，默认：15分钟	O */
  HandleTimeout?: number
}
