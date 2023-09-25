import { GarbageBaseUrl } from '../IUrl'

export class Resource {
  create(): string {
    return GarbageBaseUrl.garbage_gateway + 'Resources'
  }
  edit(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Resources/${id}`
  }
  del(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Resources/${id}`
  }
  get(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Resources/${id}`
  }
  list(): string {
    return GarbageBaseUrl.garbage_gateway + 'Resources/List'
  }
}

export class MediumPicture {
  add() {
    return GarbageBaseUrl.garbage_gateway + `Pictures`
  }

  binary() {
    return GarbageBaseUrl.garbage_gateway + 'Pictures/Binary'
  }

  picture() {
    return GarbageBaseUrl.garbage_gateway + `Pictures`
  }

  getData(id: string, serverId: string) {
    return (
      GarbageBaseUrl.garbage_gateway +
      `Pictures/${id}/Data?ServerId=${serverId}`
    )
  }

  getJPG(id: string, serverId: string) {
    return (
      GarbageBaseUrl.garbage_gateway + `Pictures/${id}.jpg?ServerId=${serverId}`
    )
  }
}

export class ResourceEncodeDevice {
  create(): string {
    return GarbageBaseUrl.garbage_gateway + 'Resources/EncodeDevices'
  }
  edit(devId: string): string {
    return GarbageBaseUrl.garbage_gateway + `Resources/EncodeDevices/${devId}`
  }
  del(devId: string): string {
    return GarbageBaseUrl.garbage_gateway + `Resources/EncodeDevices/${devId}`
  }
  get(devId: string): string {
    return GarbageBaseUrl.garbage_gateway + `Resources/EncodeDevices/${devId}`
  }
  list(): string {
    return GarbageBaseUrl.garbage_gateway + 'Resources/EncodeDevices/List'
  }

  protocol() {
    return GarbageBaseUrl.garbage_gateway + 'Resources/EncodeDevices/Protocols'
  }
}

export class ResourceCamera {
  create(): string {
    return GarbageBaseUrl.garbage_gateway + 'Resources/Cameras'
  }
  edit(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Resources/Cameras/${id}`
  }
  del(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Resources/Cameras/${id}`
  }
  get(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Resources/Cameras/${id}`
  }
  list(): string {
    return GarbageBaseUrl.garbage_gateway + 'Resources/Cameras/List'
  }
}

export class ResourceCameraAIModel {
  create(cameraId: string, modelId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `Resources/Cameras/${cameraId}/AIModels/${modelId}`
    )
  }
  edit(cameraId: string, modelId: string): string {
    return ``
  }
  del(cameraId: string, modelId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `Resources/Cameras/${cameraId}/AIModels/${modelId}`
    )
  }
  get(cameraId: string, modelId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `Resources/Cameras/${cameraId}/AIModels/${modelId}`
    )
  }
  list(cameraId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway + `Resources/Cameras/${cameraId}/AIModels`
    )
  }
  copy(cameraId: string) {
    return (
      GarbageBaseUrl.garbage_gateway +
      `Resources/Cameras/${cameraId}/AIModels/CopyTo`
    )
  }
}

export class Label {
  create(): string {
    return GarbageBaseUrl.garbage_gateway + 'Resources/Labels'
  }
  edit(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Resources/Labels/${id}`
  }
  del(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Resources/Labels/${id}`
  }
  get(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Resources/Labels/${id}`
  }
  list(): string {
    return GarbageBaseUrl.garbage_gateway + 'Resources/Labels/List'
  }
}

export class ResourceLabel {
  create(sourceId: string, labelId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway + `Resources/${sourceId}/Labels/${labelId}`
    )
  }
  edit(id: string): string {
    return ``
  }
  del(sourceId: string, labelId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway + `Resources/${sourceId}/Labels/${labelId}`
    )
  }
  get(sourceId: string, labelId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway + `Resources/${sourceId}/Labels/${labelId}`
    )
  }
  list(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Resources/${id}/Labels`
  }
}
