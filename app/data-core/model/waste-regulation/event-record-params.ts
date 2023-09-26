import { Transform } from 'class-transformer'
import { OrderType } from '../../enums/order-type.enum'
import { PagedParams } from '../page'
import { transformDateTime } from '../transformer'
import { CompareRange } from './compare-range.model'
import { FeedbackResult } from './garbage-drop-feedback.model'
import {
  GarbageDropSuperVisionLevel,
  SupervisedState,
} from './garbage-drop-super-vision-data.model'

/**获取事件记录参数 */
export class GetEventRecordsParams extends PagedParams {
  /**开始时间 */
  @Transform(transformDateTime)
  BeginTime!: Date
  /**结束时间 */
  @Transform(transformDateTime)
  EndTime!: Date
  /**所属区划ID列表(可选) */
  DivisionIds?: string[]
  /**垃圾房ID列表(可选) */
  StationIds?: string[]
  /**资源ID列表(可选) */
  ResourceIds?: string[]
  /**区划名称(可选)，支持LIKE */
  DivisionName?: string
  /**垃圾房名称(可选)，支持LIKE */
  StationName?: string
  /**资源名称(可选)，支持LIKE */
  ResourceName?: string
  /** 是否倒序时间排列 */
  Desc?: boolean
}

export class GetGarbageDropEventRecordsParams extends GetEventRecordsParams {
  /**
   *	所属网格ID列表	O
   *
   * @type {string[]}
   * @memberof GetGarbageDropEventRecordsParams
   */
  GridCellIds?: string[]
  /**
   *	网格名称，支持LIKE	O
   *
   * @type {string}
   * @memberof GetGarbageDropEventRecordsParams
   */
  GridCellName?: string
  /**
   *	是否已处置	O
   *
   * @type {boolean}
   * @memberof GetGarbageDropEventRecordsParams
   */
  IsHandle?: boolean
  /**
   *	是否已超时	O
   *
   * @type {boolean}
   * @memberof GetGarbageDropEventRecordsParams
   */
  IsTimeout?: boolean
  /**	String[]	所属小区ID列表	O */
  CommunityIds?: string[]
  /**	String	小区名称，支持LIKE	O */
  CommunityName?: string
  /**	String	工单号，支持LIKE	O */
  RecordNo?: string

  TakeMinutes?: CompareRange<number>
  /**	String	处置时长排序 ASC，DESC，不区分大小写	O */
  TakeMinutesOrderBy?: OrderType
  /**	String	落地时间排序 ASC，DESC，不区分大小写	O */
  DropTimeOrderBy?: OrderType
  /**	String	处置时间排序 ASC，DESC，不区分大小写	O */
  HandleTimeOrderBy?: OrderType

  /**	Int32	"督办级别
1：一级事件（垃圾落地）
2：二级事件（滞留）
3：三级事件（超级滞留）"	O	*/
  Level?: GarbageDropSuperVisionLevel
  /**	Int32	"督办状态
0：未督办（待督办）
1：已督办"	O	*/
  SupervisedState?: SupervisedState
  /**
   * Int32	"反馈状态 0：表示没有人员反馈。1：表示已反馈"	O	*/
  FeedbackState?: number
  /**	Double	"反馈用时单位：秒大于的数值"	O	*/
  FeedbackSecondsGe?: number
  /**	Double	"反馈用时单位：秒小于的数值"	O	*/
  FeedbackSecondsLe?: number
  /**	String	反馈人员名称	O	*/
  FeedbackUserName?: string
  /**	String	反馈人员手机号码	O	*/
  FeedbackUserMobileNo?: string
  /**	Int32	反馈结果：1：完成，2：误报，3：管理不规范	O	*/
  FeedbackResult?: FeedbackResult
  /**	String	反馈人员ID	O	*/
  FeedbackUserId?: string
}

export interface GarbageDropProcessParams {
  /**	String	处置人员名称	M */
  ProcessorName: string
  /**	String	处置人员ID	M */
  ProcessorId: string
  /**	String	手机号码	M */
  ProcessorMobileNo: string
  /**	String	处置描述	O */
  ProcessDescription?: string
}
export class GarbageFeedbackParams {
  /**	Double	反馈时距离，单位：米	O	*/ FeedbackDistance?: number
  /**	String	反馈人员名称	M	*/ FeedbackUserName!: string
  /**	String	反馈人员ID	M	*/ FeedbackUserId!: string
  /**	String	反馈人员手机号码	O	*/ FeedbackUserMobileNo?: string
  /**	Int32	"用户类型
1-街道管理人员，2-居委管理人员，3-志愿者，4-物业管理人员，5-其他，6-第三方。"	M	*/ FeedbackUserType!: number
  /**	Int32	"反馈结果：
1：完成，2：误报，3：管理不规范"	M	*/ FeedbackResult!: number
  /**	String	反馈描述	O	*/ FeedbackDescription?: string
  /**	String[]	反馈照片	O	*/ FeedbackImageUrls?: string[]
}
