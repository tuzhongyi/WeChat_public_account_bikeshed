import { plainToClass } from 'class-transformer'
import { SmsProtocolType } from '../enums/sms-protocol-type.enum'
import { AuthCode } from '../model/auth-code'
import { HowellResponse } from '../model/response'
import { SmsUrl } from '../url/sms-url'
import { HowellAuthHttp } from './howell-auth-http'

export class SmsRequestService {
  constructor(private requestService: HowellAuthHttp) {}

  async getAuthCodes(PhoneNo: string) {
    let response = await this.requestService.get<HowellResponse<AuthCode>>(
      SmsUrl.authcodes(PhoneNo)
    )
    let result = plainToClass(AuthCode, response.Data)
    return result
  }
  async postAuthCodes(
    phoneNo: string,
    protocolType: SmsProtocolType = SmsProtocolType.aliyun
  ) {
    let response = await this.requestService.post<
      any,
      HowellResponse<AuthCode>
    >(SmsUrl.authcodes(phoneNo, protocolType))

    let result = plainToClass(AuthCode, response.Data)
    return result
  }
}
