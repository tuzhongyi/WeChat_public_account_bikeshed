import { GarbageBaseUrl } from '../IUrl'

export class ServersUrl extends GarbageBaseUrl {
  static create() {
    return GarbageBaseUrl.garbage_gateway + `Servers`
  }
  static item(serviceId: string) {
    return GarbageBaseUrl.garbage_gateway + `Servers/${serviceId}`
  }
  static list() {
    return GarbageBaseUrl.garbage_gateway + `Servers/List`
  }
  static sync(serviceId: string) {
    return GarbageBaseUrl.garbage_gateway + `Servers/${serviceId}/Sync`
  }
  static divisions(serviceId: string) {
    return (
      GarbageBaseUrl.garbage_gateway + `Servers/${serviceId}/Divisions/List`
    )
  }
  static garbageStations(serviceId: string) {
    return (
      GarbageBaseUrl.garbage_gateway +
      ` Servers/${serviceId}/GarbageStations/List`
    )
  }
  static pictures(serviceId: string, pictureId: string) {
    return (
      GarbageBaseUrl.garbage_gateway +
      `Servers/${serviceId}/Pictures/${pictureId}.jpg`
    )
  }
}
