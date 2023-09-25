import { SessionUser } from '../../common/session-user'
import { BaseUrl, GarbageBaseUrl } from './IUrl'
export class Mediume extends BaseUrl {
  add() {
    return GarbageBaseUrl.garbage_gateway + `Pictures`
  }

  getData(id: string) {
    const u = new SessionUser()
    if (u.WUser)
      return (
        GarbageBaseUrl.garbage_gateway +
        `Pictures/${id}.jpg?ServerId=${u.WUser.ServerId}`
      )
  }

  getJPG(jpg: string) {
    return GarbageBaseUrl.garbage_gateway + `Pictures/${jpg}`
  }
}
