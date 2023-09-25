import { Transform } from 'class-transformer'
import { transformDateTime } from '../transformer'

export class GarbageDropSuperVisionData {
  /**	Int32	"督办级别
1：一级事件（垃圾落地）
2：二级事件（滞留）
3：三级事件（超级滞留）"	M	*/
  Level!: GarbageDropSuperVisionLevel
  /**	DateTime	一级事件时间	O	*/
  @Transform(transformDateTime)
  Level1Time?: Date
  /**	DateTime	二级事件时间	O	*/
  @Transform(transformDateTime)
  Level2Time?: Date
  /**	DateTime	三级事件时间	O	*/
  @Transform(transformDateTime)
  Level3Time?: Date
  /**	String	三种级别事件描述	O	*/
  LevelDescription?: string
  /**	Int32	"督办状态
0：未督办（待督办）
1：已督办"	O	*/
  SupervisedState?: SupervisedState
  /**	DateTime	督办时间	O	*/
  @Transform(transformDateTime)
  SupervisedTime?: Date
  /**	String	督办人员	O	*/
  Supervisor?: string
  /**	Int32	"督办结果
1：完成，2：误报，3：管理不规范，4：无人响应，5：未按时间完成处置。"	O	*/
  SuperviseResult?: SuperviseResult
  /**	String	督办描述	O	*/
  SuperviseDescription?: string
  /**	String	督办时通知的人员ID	O	*/
  CallUserId?: string
  /**	String	督办时通知的人员姓名	O	*/
  CallUserName?: string
  /**	String	督办时通知的人员手机号码	O	*/
  CallUserMobileNo?: string
  /**	Int32	"接单状态：
0：未有人接单
1：已接单"	O	*/
  AcceptedState?: AcceptedState
  /**	String	接单人员名称	O	*/
  AcceptedUserName?: string
  /**	String	接单人员ID	O	*/
  AcceptedUserId?: string
  /**	String	接单人员手机号码	O	*/
  AcceptedUserMobileNo?: string
  /**	DateTime	接单时间	O	*/
  @Transform(transformDateTime)
  AcceptedTime?: Date
  /**	Boolean	是否发送微信通知，默认：false不发送	O	*/
  WechatNotification?: boolean
}
/**	Int32	"督办级别
1：一级事件（垃圾落地）
2：二级事件（滞留）
3：三级事件（超级滞留）"	M	*/
export enum GarbageDropSuperVisionLevel {
  one = 1,
  two = 2,
  three = 3,
}
/**	Int32	"督办状态
0：未督办（待督办）
1：已督办"	O	*/
export enum SupervisedState {
  no = 0,
  yes = 1,
}
/**	Int32	"督办结果
1：完成，2：误报，3：管理不规范，4：无人响应，5：未按时间完成处置。"	O	*/
export enum SuperviseResult {
  complete = 1,
  misclassified = 2,
  unorganized = 3,
  noresponse = 4,
  notcompleted = 5,
}
/**	Int32	"接单状态：
0：未有人接单
1：已接单"	O	*/
export enum AcceptedState {
  nobody = 0,
  already = 1,
}
