import { GarbageBaseUrl } from '../IUrl'

export class GarbageStations extends GarbageBaseUrl {
  garbagestations = 'garbage_management/'
  create(): string {
    return GarbageBaseUrl.garbage_gateway + 'GarbageStations'
  }
  edit(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `GarbageStations/${id}`
  }
  del(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `GarbageStations/${id}`
  }
  get(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `GarbageStations/${id}`
  }
  list(): string {
    return GarbageBaseUrl.garbage_gateway + `GarbageStations/List`
  }

  volumesHistory(id: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `GarbageStations/${id}/Volumes/History/List`
    )
  }

  eventNumbersHistory(id: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `GarbageStations/${id}/EventNumbers/History/List`
    )
  }

  statisticNumber(id: string): string {
    return (
      GarbageBaseUrl.garbage_gateway + `GarbageStations/${id}/Statistic/Number`
    )
  }

  statisticNumberList(): string {
    return (
      GarbageBaseUrl.garbage_gateway + `GarbageStations/Statistic/Number/List`
    )
  }
  statisticNumberHistoryList(): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `GarbageStations/Statistic/Number/History/List`
    )
  }
  statisticGarbageCountHistoryList(): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `GarbageStations/Statistic/GarbageCount/History/List`
    )
  }
}

export class Camera extends GarbageBaseUrl {
  create(stationId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway + `GarbageStations/${stationId}/Cameras`
    )
  }
  edit(stationId: string, cameraId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `GarbageStations/${stationId}/Cameras/${cameraId}`
    )
  }
  del(stationId: string, cameraId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `GarbageStations/${stationId}/Cameras/${cameraId}`
    )
  }
  get(stationId: string, cameraId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `GarbageStations/${stationId}/Cameras/${cameraId}`
    )
  }
  list(): string {
    return GarbageBaseUrl.garbage_gateway + `GarbageStations/Cameras/List`
  }
}

export class CameraTrashCans extends GarbageBaseUrl {
  create(stationId: string, cameraId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans`
    )
  }
  edit(stationId: string, cameraId: string, trashCansId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans/${trashCansId}`
    )
  }
  del(stationId: string, cameraId: string, trashCansId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans/${trashCansId}`
    )
  }
  get(stationId: string, cameraId: string, trashCansId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans/${trashCansId}`
    )
  }
  list(stationId: string, cameraId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans`
    )
  }
}

export class GarbageStationTrashCans extends GarbageBaseUrl {
  create(stationId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway + `GarbageStations/${stationId}/TrashCans`
    )
  }
  edit(stationId: string, trashCansId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `GarbageStations/${stationId}/TrashCans/${trashCansId}`
    )
  }
  del(stationId: string, trashCansId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `GarbageStations/${stationId}/TrashCans/${trashCansId}`
    )
  }
  get(stationId: string, trashCansId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `GarbageStations/${stationId}/TrashCans/${trashCansId}`
    )
  }
  postList(): string {
    return GarbageBaseUrl.garbage_gateway + `GarbageStations/TrashCans/List`
  }
  list(stationId: string): string {
    return (
      GarbageBaseUrl.garbage_gateway + `GarbageStations/${stationId}/TrashCans`
    )
  }
}

export class GarbageStationType extends GarbageBaseUrl {
  create(): string {
    return GarbageBaseUrl.garbage_gateway + 'GarbageStations/Types'
  }
  edit(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `GarbageStations/Types/${id}`
  }
  del(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `GarbageStations/Types/${id}`
  }
  get(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `GarbageStations/Types/${id}`
  }
  list() {
    return GarbageBaseUrl.garbage_gateway + 'GarbageStations/Types'
  }
}
