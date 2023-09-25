import { GarbageBaseUrl } from '../IUrl'

export class Division extends GarbageBaseUrl {
  create(): string {
    return GarbageBaseUrl.garbage_gateway + 'Divisions'
  }
  edit(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Divisions/${id}`
  }
  del(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Divisions/${id}`
  }
  get(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Divisions/${id}`
  }
  list(): string {
    return GarbageBaseUrl.garbage_gateway + `Divisions/List`
  }

  garbageStations(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Divisions/${id}/GarbageStations`
  }

  tree(): string {
    return GarbageBaseUrl.garbage_gateway + `Divisions/Tree`
  }

  volumesHistory(id: string): string {
    return (
      GarbageBaseUrl.garbage_gateway + `Divisions/${id}/Volumes/History/List`
    )
  }

  eventNumbersHistory(id: string): string {
    return (
      GarbageBaseUrl.garbage_gateway +
      `Divisions/${id}/EventNumbers/History/List`
    )
  }

  statisticNumber(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `Divisions/${id}/Statistic/Number`
  }

  statisticNumberList(): string {
    return GarbageBaseUrl.garbage_gateway + `Divisions/Statistic/Number/List`
  }
}
