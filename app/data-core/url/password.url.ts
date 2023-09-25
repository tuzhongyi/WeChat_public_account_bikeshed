import { BaseUrl } from './IUrl'

export class PasswordUrl {
  static basic() {
    return `${BaseUrl.user_system}/Passwords`
  }
  static item(id: string) {
    return `${this.basic()}/${id}`
  }
  static list() {
    return `${this.basic()}/List`
  }
  static checkCode(mobileNo?: string) {
    let params = ''
    if (mobileNo) {
      params = `?=${mobileNo}`
    }
    return `${this.basic()}/CheckCode${params}`
  }
  static checkMobileNo(mobileNo: string) {
    return `${this.basic()}/CheckMobileNo?MobileNo=${mobileNo}`
  }
}
