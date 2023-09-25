import { classToPlain, plainToClass } from 'class-transformer'
import { PagedList } from '../model/page'
import { HowellResponse, HttpResponse, ResponseBase } from '../model/response'
import { SaveModel } from '../model/save-model'
import {
  ChangeUserPasswordParams,
  CheckCodeParams,
  PasswordCheckCodeResult,
  RandomUserPaswordParams,
} from '../model/user-password'
import {
  GetUserLabelsParams,
  Role,
  User,
  UserLabel,
  UserLabelType,
} from '../model/user-stystem'
import { PasswordUrl } from '../url/password.url'
import { UserUrl } from '../url/user-url'

import { HowellAuthHttp } from './howell-auth-http'

// 用户信息服务
export class UserRequestService extends SaveModel {
  constructor(private requestService: HowellAuthHttp) {
    super()
    this.label = new UserLabelRequestService(requestService)
  }

  // 获取用户信息列表
  async list(index: number = 1, size: number = 9999) {
    let query = `?PageIndex=${index}&PageSize=${size}`
    let response = await this.requestService.get<
      HowellResponse<PagedList<User>>
    >(UserUrl.list() + query)
    response.Data.Data = plainToClass(User, response.Data.Data)
    return response.Data
  }
  // 创建用户
  create(user: User) {
    let data = classToPlain(user) as User
    return this.requestService.post<User, ResponseBase>(UserUrl.list(), data)
  }
  // 获取用户信息
  async get(userId: string) {
    let response = await this.requestService.get<HowellResponse<User>>(
      UserUrl.item(userId)
    )
    return plainToClass(User, response.Data)
  }
  // 修改用户信息
  update(user: User) {
    let data = classToPlain(user) as User
    return this.requestService.put<User, ResponseBase>(
      UserUrl.item(user.Id),
      data
    )
  }
  // 删除用户
  delete(userId: string) {
    return this.requestService.delete<ResponseBase>(UserUrl.item(userId))
  }
  // 获取用户下所有规则
  async getRoleList(userId: string, index: number = 1, size: number = 9999) {
    let query = `?PageIndex=${index}&PageSize=${size}`
    let response = await this.requestService.get<
      HowellResponse<PagedList<Role>>
    >(UserUrl.role.list(userId) + query)
    response.Data.Data = plainToClass(Role, response.Data.Data)
    return response.Data
  }
  // 获取用户下单个规则
  async getRole(userId: string, roleId: string) {
    let response = await this.requestService.get<HowellResponse<Role>>(
      UserUrl.role.item(userId, roleId)
    )
    return plainToClass(Role, response.Data)
  }

  label: UserLabelRequestService

  private _password?: PasswordsService
  public get password(): PasswordsService {
    if (!this._password) {
      this._password = new PasswordsService(this.requestService)
    }
    return this._password
  }
}

class UserLabelRequestService {
  constructor(private requestService: HowellAuthHttp) {}

  async getList(params: GetUserLabelsParams = new GetUserLabelsParams()) {
    let response = await this.requestService.post<
      GetUserLabelsParams,
      PagedList<UserLabel>
    >(UserUrl.label.list(), params)
    return plainToClass(UserLabel, response.Data)
  }

  async get(garbageStationId: string, type: UserLabelType) {
    let response = await this.requestService.get<UserLabel>(
      UserUrl.label.type(garbageStationId, type)
    )
    return plainToClass(UserLabel, response)
  }

  async delete(garbageStationId: string, type: UserLabelType) {
    let response = await this.requestService.delete<HttpResponse<ResponseBase>>(
      UserUrl.label.type(garbageStationId, type)
    )
    return response.data
  }
  post(garbageStationId: string, type: UserLabelType, label: UserLabel) {
    return this.requestService.post<UserLabel, ResponseBase>(
      UserUrl.label.type(garbageStationId, type),
      label
    )
  }
  async put(garbageStationId: string, type: UserLabelType, label: UserLabel) {
    let response = await this.requestService.put<
      UserLabel,
      HttpResponse<ResponseBase>
    >(UserUrl.label.type(garbageStationId, type), label)
    return response.data
  }
}

class PasswordsService {
  constructor(private http: HowellAuthHttp) {}

  random(userId: string, params: RandomUserPaswordParams): Promise<string> {
    let url = UserUrl.password(userId).random()
    let data = classToPlain(params)
    return this.http.post<any, string>(url, data)
  }

  change(userId: string, params: ChangeUserPasswordParams) {
    let url = UserUrl.password(userId).change()
    let data = classToPlain(params)
    return this.http.post(url, User, data)
  }

  private _check?: PasswordCheckService
  public get check(): PasswordCheckService {
    if (!this._check) {
      this._check = new PasswordCheckService(this.http)
    }
    return this._check
  }
}

class PasswordCheckService {
  constructor(private http: HowellAuthHttp) {}

  mobileNo(mobileNo: string): Promise<ResponseBase> {
    let url = PasswordUrl.checkMobileNo(mobileNo)
    return this.http.get(url)
  }

  code(mobileNo?: string) {
    let url = PasswordUrl.checkCode(mobileNo)
    return this.http.get<string>(url)
  }

  check(params: CheckCodeParams): Promise<PasswordCheckCodeResult> {
    let data = classToPlain(params)
    let url = PasswordUrl.checkCode()
    return this.http.post<any, PasswordCheckCodeResult>(url, data)
  }
}
