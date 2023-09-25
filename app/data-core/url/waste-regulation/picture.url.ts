import { GarbageBaseUrl } from '../IUrl'

export class ServerPictureUrl {
  static basic(serverId?: string) {
    return `${GarbageBaseUrl.garbage_gateway}Pictures${
      serverId ? '?ServerId=' + serverId : ''
    }`
  }
  static jpg(pictureId: string, serverId?: string) {
    return `${this.basic()}/${pictureId}.jpg${
      serverId ? '?ServerId=' + serverId : ''
    }`
  }
  static data(pictureId: string, serverId?: string) {
    return `${this.basic()}/${pictureId}/Data${
      serverId ? '?ServerId=' + serverId : ''
    }`
  }
}
