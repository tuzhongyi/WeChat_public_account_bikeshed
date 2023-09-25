import { BaseUrl } from './IUrl'

export class UserCodeUrl {
  getCode(phoneNumber: string) {
    return BaseUrl.wechat + 'GetVerificationCode?phoneNumber=' + phoneNumber
  }

  checkCode(phoneNumber: string, code: string) {
    return (
      BaseUrl.wechat +
      `CheckVerificationCode?phoneNumber=${phoneNumber}&code=${code}`
    )
  }
}

export class UserRoleUrl {
  list(userId: string) {
    const basic = UserUrl.item(userId)
    return `${basic}/Roles`
  }
  item(userId: string, roleId: string) {
    const basic = this.list(userId)
    return `${basic}/${roleId}`
  }
}

export class UserLabelUrl {
  basic() {
    return `${UserUrl.list()}/Labels`
  }
  list() {
    return `${this.basic()}/List`
  }
  type(garbageStationId: string, type: number) {
    return `${this.basic()}/${garbageStationId}/LabelTypes/${type}`
  }
}
class UserPasswordUrl {
  constructor(private base: string) {}

  basic() {
    return `${this.base}/Passwords`
  }

  list() {
    return `${this.basic()}/List`
  }

  item(id: string) {
    return `${this.basic()}/${id}`
  }

  random() {
    return `${this.basic()}/Random`
  }

  change() {
    return `${this.basic()}/Change`
  }
}

export class UserUrl extends BaseUrl {
  static list() {
    return BaseUrl.user_system + `Users`
  }

  static item(id: string) {
    return `${this.list()}/${id}`
  }
  static login(name: string) {
    return `${this.list()}/Login/${name}`
  }
  static config(id: string, configType: string) {
    return `${this.list()}/${id}/Config/${configType}`
  }
  static role: UserRoleUrl = new UserRoleUrl()

  static label: UserLabelUrl = new UserLabelUrl()

  static password(userId: string) {
    return new UserPasswordUrl(UserUrl.item(userId))
  }
}

export class WeChat extends BaseUrl {
  create() {
    return BaseUrl.user_system + 'WeChat/Users'
  }

  list() {
    return BaseUrl.user_system + 'WeChat/Users'
  }

  get(id: string) {
    return BaseUrl.user_system + `WeChat/Users/${id}`
  }

  edit(id: string) {
    return BaseUrl.user_system + `WeChat/Users/${id}`
  }

  del(id: string) {
    return BaseUrl.user_system + `WeChat/Users/${id}`
  }

  binding(phoneNumber: string, openId: string) {
    return (
      BaseUrl.user_system +
      `WeChat/Users/Binding?MobileNo=${phoneNumber}&OpenId=${openId}`
    )
  }

  openIds(id: string) {
    return BaseUrl.user_system + `WeChat/Users/Resources/${id}/OpenIds`
  }
}

export class Roles extends BaseUrl {
  list() {
    return BaseUrl.user_system + `Roles`
  }

  item(id: string) {
    return BaseUrl.user_system + `Roles/${id}`
  }

  user_list(id: string) {
    return BaseUrl.user_system + `Roles/${id}/Users`
  }

  user_item(id: string, userId: string) {
    return BaseUrl.user_system + `Roles/${id}/Users/${userId}`
  }
}
