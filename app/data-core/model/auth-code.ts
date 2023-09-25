import { Transform } from 'class-transformer'
import { transformDateTime } from './transformer'

export class AuthCode {
  /**	String	手机号码	M */
  PhoneNo!: string
  /**	String	验证码数值(6位数字)	M */
  Code!: string
  /**	String	协议类型(短信运营商) 默认：aliyun	O */
  ProtocolType?: string
  /**	DateTime	创建时间	M */
  @Transform(transformDateTime)
  CreateTime!: Date
  /**	DateTime	过期时间	M */
  @Transform(transformDateTime)
  ExpirationTime!: Date
  /**	String	回执ID	O */
  BizId?: string
  /**	String	回执状态码	O */
  BizCode?: string
}
