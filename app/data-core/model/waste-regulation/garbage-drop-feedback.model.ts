import { Transform } from 'class-transformer'
import { transformDateTime } from '../transformer'

export class GarbageDropFeedback {
  /**	String	反馈ID	M	*/
  FeedbackId!: string
  /**	Double	反馈时的距离，单位：米	O	*/
  FeedbackDistance?: number
  /**	String	反馈人员名称	M	*/
  FeedbackUserName!: string
  /**	String	反馈人员ID	M	*/
  FeedbackUserId!: string
  /**	String	反馈人员手机号码	O	*/
  FeedbackUserMobileNo?: string
  /**	DateTime	反馈时间	M	*/
  @Transform(transformDateTime)
  FeedbackTime!: Date
  /**	Int32	"反馈结果：
1：完成，2：误报，3：管理不规范"	M	*/
  FeedbackResult!: FeedbackResult
  /**	String	反馈描述	O	*/
  FeedbackDescription?: string
  /**	String[]	反馈照片	O	*/
  FeedbackImageUrls?: string[]
  /**	
   *  Int32	"用户类型
      1-街道管理人员，2-居委管理人员，3-志愿者，4-物业管理人员，5-其他，6-第三方。"
	    M
	*/
  FeedbackUserType!: number
}
export enum FeedbackResult {
  /** 1：完成 */
  complete = 1,
  /** 2：误报 */
  falsealarm = 2,
  /** 3：管理不规范 */
  nostandard = 3,
}
