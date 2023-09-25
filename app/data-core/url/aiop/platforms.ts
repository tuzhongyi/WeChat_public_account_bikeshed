import { GarbageBaseUrl } from '../IUrl'

export class Platform {
  create(): string {
    return GarbageBaseUrl.garbage_gateway + 'Platforms'
  }
  edit(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Platforms/${id}`
  }
  del(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Platforms/${id}`
  }
  get(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Platforms/${id}`
  }
  list(): string {
    return GarbageBaseUrl.garbage_gateway + 'Platforms/List'
  }
  sync(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Platforms/${id}/Sync`
  }

  protocols() {
    return GarbageBaseUrl.garbage_gateway + `Platforms/Protocols`
  }
}
