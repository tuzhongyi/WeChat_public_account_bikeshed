import { GarbageBaseUrl } from '../IUrl'

export class Region {
  create(): string {
    return GarbageBaseUrl.garbage_gateway + 'Regions'
  }
  edit(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Regions/${id}`
  }
  del(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Regions/${id}`
  }
  get(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Regions/${id}`
  }
  list(): string {
    return GarbageBaseUrl.garbage_gateway + 'Regions/List'
  }
}

export class RegionsResources {
  batch(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Regions/${id}/Resources`
  }

  create(regionId: string, resourceId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `Regions/${regionId}/Resources/${resourceId}`
    )
  }

  del(regionId: string, resourceId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `Regions/${regionId}/Resources/${resourceId}`
    )
  }
  get(regionId: string, resourceId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `Regions/${regionId}/Resources/${resourceId}`
    )
  }
}
