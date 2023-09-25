import { SmsProtocolType } from '../enums/sms-protocol-type.enum'
import { GarbageBaseUrl } from './IUrl'

export class SmsUrl extends GarbageBaseUrl {
  static authcodes(phoneNo: string, protocolType?: SmsProtocolType) {
    let type = ''
    if (protocolType) {
      type = `&ProtocolType=${protocolType}`
    }
    return `${this.sms}AuthCodes?PhoneNo=${phoneNo}${type}`
  }
}
