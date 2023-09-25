import { User } from '../../model/user-stystem'
import { SmsRequestService } from '../sms.service'
import { UserRequestService } from '../user.service'

export class MobileBindingService {
  constructor(
    private userService: UserRequestService,
    private smsService: SmsRequestService
  ) {}

  async check(mobileNo: string) {
    let response = await this.userService.password.check.mobileNo(mobileNo)
    return response.FaultCode === 0
  }

  sendCheckCode(mobileNo: string) {
    return this.smsService.postAuthCodes(mobileNo)
  }

  async setUser(user: User) {
    let response = await this.userService.update(user)
    return response.FaultCode == 0
  }
}
