import { GarbageBaseUrl } from '../IUrl'

export class MediumPicture {
  getData(id: string) {
    return GarbageBaseUrl.garbage_gateway + `Pictures/${id}/Data`
  }

  getJPG(id: string) {
    return GarbageBaseUrl.garbage_gateway + `Pictures/${id}.jpg`
  }
}
