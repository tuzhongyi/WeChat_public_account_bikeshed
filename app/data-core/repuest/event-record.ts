import { classToPlain, plainToClass } from 'class-transformer'
import { PagedList } from '../model/page'
import { HowellResponse } from '../model/response'
import {
  GarbageDropEventRecord,
  GarbageFullEventRecord,
  IllegalDropEventRecord,
  MixedIntoEventRecord,
} from '../model/waste-regulation/event-record'
import {
  GarbageDropProcessParams,
  GarbageFeedbackParams,
  GetEventRecordsParams,
  GetGarbageDropEventRecordsParams,
} from '../model/waste-regulation/event-record-params'
import * as url from '../url/waste-regulation/event'
import { HowellAuthHttp } from './howell-auth-http'

export class EventRequestService {
  constructor(private http: HowellAuthHttp) {}

  private _record?: EventRecordRequestService
  public get record(): EventRecordRequestService {
    if (!this._record) {
      this._record = new EventRecordRequestService(this.http)
    }
    return this._record
  }
}
class EventRecordRequestService {
  constructor(private http: HowellAuthHttp) {}
  garbageDrop = new EventRecordGarbageDropRequestService(this.http)
  illegalDrop = new EventRecordIllegalDropRequestService(this.http)
  mixedInto = new EventRecordMixedIntoRequestService(this.http)
  garbageFull = new EventRecordGarbageFullRequestService(this.http)
}
class EventRecordIllegalDropRequestService {
  constructor(private http: HowellAuthHttp) {}

  async list(item: GetEventRecordsParams) {
    let response = await this.http.post<
      GetEventRecordsParams,
      HowellResponse<PagedList<IllegalDropEventRecord>>
    >(url.EventUrl.record.illegaldrop.list(), item)
    response.Data.Data = plainToClass(
      IllegalDropEventRecord,
      response.Data.Data
    )
    return response.Data
  }
  async get(id: string) {
    let response = await this.http.get<HowellResponse<IllegalDropEventRecord>>(
      url.EventUrl.record.illegaldrop.item(id)
    )
    return plainToClass(IllegalDropEventRecord, response.Data)
  }
}
class EventRecordGarbageFullRequestService {
  constructor(private http: HowellAuthHttp) {}

  async list(item: GetEventRecordsParams) {
    let response = await this.http.post<
      GetEventRecordsParams,
      HowellResponse<PagedList<GarbageFullEventRecord>>
    >(url.EventUrl.record.garbagefull.list(), item)
    response.Data.Data = plainToClass(
      GarbageFullEventRecord,
      response.Data.Data
    )
    return response.Data
  }
  async get(id: string) {
    let response = await this.http.get<HowellResponse<GarbageFullEventRecord>>(
      url.EventUrl.record.garbagefull.item(id)
    )
    return plainToClass(GarbageFullEventRecord, response.Data)
  }
}
class EventRecordMixedIntoRequestService {
  constructor(private http: HowellAuthHttp) {}

  async list(item: GetEventRecordsParams) {
    let response = await this.http.post<
      GetEventRecordsParams,
      HowellResponse<PagedList<MixedIntoEventRecord>>
    >(url.EventUrl.record.mixedinto.list(), item)
    response.Data.Data = plainToClass(MixedIntoEventRecord, response.Data.Data)
    return response.Data
  }
  async get(id: string) {
    let response = await this.http.get<HowellResponse<MixedIntoEventRecord>>(
      url.EventUrl.record.mixedinto.item(id)
    )
    return plainToClass(MixedIntoEventRecord, response.Data)
  }
}
class EventRecordGarbageDropRequestService {
  constructor(private http: HowellAuthHttp) {}

  async list(item: GetGarbageDropEventRecordsParams) {
    let response = await this.http.post<
      GetGarbageDropEventRecordsParams,
      HowellResponse<PagedList<GarbageDropEventRecord>>
    >(url.EventUrl.record.garbagedrop.list(), item)
    response.Data.Data = plainToClass(
      GarbageDropEventRecord,
      response.Data.Data
    )
    return response.Data
  }
  async get(id: string) {
    let response = await this.http.get<HowellResponse<GarbageDropEventRecord>>(
      url.EventUrl.record.garbagedrop.item(id)
    )

    return plainToClass(GarbageDropEventRecord, response.Data)
  }
  async process(id: string, params: GarbageDropProcessParams) {
    let data = classToPlain(params) as GarbageDropProcessParams
    let response = await this.http.post<
      GarbageDropProcessParams,
      HowellResponse<GarbageDropEventRecord>
    >(url.EventUrl.record.garbagedrop.process(id), data)
    return response.Data
  }
  async feedback(id: string, params: GarbageFeedbackParams) {
    let plain = classToPlain(params)

    let response = await this.http.post<
      any,
      HowellResponse<GarbageDropEventRecord>
    >(url.EventUrl.record.garbagedrop.feedback(id), plain)
    return response.Data
  }
}
