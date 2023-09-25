import { GarbageBaseUrl } from '../IUrl'

class EventRecordUrl {
  constructor(private base: string) {}
  basic() {
    return `${this.base}/Records`
  }
  garbagedrop = new EventRecordGarbageDropUrl(this.basic())
  illegaldrop = new EventRecordIllegalDrop(this.basic())
  garbagefull = new EventRecordGarbageFull(this.basic())
  mixedinto = new EventRecordMixedInto(this.basic())
}
class EventRecordIllegalDrop {
  constructor(private base: string) {}
  basic() {
    return `${this.base}/IllegalDrop`
  }

  list() {
    return `${this.basic()}/List`
  }
  item(id: string) {
    return `${this.basic()}/${id}`
  }
}
class EventRecordMixedInto {
  constructor(private base: string) {}
  basic() {
    return `${this.base}/MixedInto`
  }

  list() {
    return `${this.basic()}/List`
  }
  item(id: string) {
    return `${this.basic()}/${id}`
  }
}
class EventRecordGarbageFull {
  constructor(private base: string) {}
  basic() {
    return `${this.base}/GarbageFull`
  }

  list() {
    return `${this.basic()}/List`
  }
  item(id: string) {
    return `${this.basic()}/${id}`
  }
}

class EventRecordGarbageDropUrl {
  constructor(private base: string) {}
  basic() {
    return `${this.base}/GarbageDrop`
  }

  list() {
    return `${this.basic()}/List`
  }
  item(id: string) {
    return `${this.basic()}/${id}`
  }
  process(id: string) {
    return `${this.item(id)}/Process`
  }
  feedback(id: string) {
    return `${this.item(id)}/Feedback`
  }
  accept(id: string) {
    return `${this.item(id)}/Accept`
  }
}

export class EventUrl extends GarbageBaseUrl {
  static basic() {
    return `${GarbageBaseUrl.garbage_gateway}Events`
  }
  infoList() {
    return GarbageBaseUrl.garbage_gateway + `Events/Infos/List`
  }

  infoEventType() {
    return GarbageBaseUrl.garbage_gateway + `Events/Infos/<EventType>`
  }

  static record = new EventRecordUrl(this.basic())
}
