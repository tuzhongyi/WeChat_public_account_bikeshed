import { GarbageBaseUrl } from '../IUrl'

export class SRServiceUrl {
  create(): string {
    return GarbageBaseUrl.garbage_gateway + 'SRServers'
  }
  edit(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `SRServers/${id}`
  }
  del(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `SRServers/${id}`
  }
  get(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `SRServers/${id}`
  }
  list(): string {
    return GarbageBaseUrl.garbage_gateway + 'SRServers'
  }
  sync(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `SRServers/${id}/Sync`
  }

  preview() {
    return GarbageBaseUrl.garbage_gateway + `SRServers/PreviewUrls`
  }

  vod() {
    return GarbageBaseUrl.garbage_gateway + `SRServers/VodUrls`
  }
}
