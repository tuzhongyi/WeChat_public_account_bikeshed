import { PagedList } from '../model/page'
import { PictureUrl } from '../model/picture-url.model'
import { HowellResponse } from '../model/response'
import {
  GetDivisionsParams,
  GetGarbageStationsParams,
  GetServersParams,
  Server,
} from '../model/server'
import { Division } from '../model/waste-regulation/division'
import { GarbageStation } from '../model/waste-regulation/garbage-station'
import { ServerPictureUrl } from '../url/waste-regulation/picture.url'
import { ServersUrl } from '../url/waste-regulation/url-servers'
import { HowellAuthHttp } from './howell-auth-http'

export class ServerRequestService {
  constructor(private requestService: HowellAuthHttp) {}

  Create(server: Server) {
    return this.requestService.post<Server, HowellResponse<Server>>(
      ServersUrl.create(),
      server
    )
  }
  Put(server: Server) {
    return this.requestService.put<Server, HowellResponse<Server>>(
      ServersUrl.create(),
      server
    )
  }
  Get(serverId: string) {
    return this.requestService.get<HowellResponse<Server>>(
      ServersUrl.item(serverId)
    )
  }
  Delete(serverId: string) {
    return this.requestService.delete<HowellResponse<Server>>(
      ServersUrl.item(serverId)
    )
  }
  List(params: GetServersParams) {
    return this.requestService.post<
      GetServersParams,
      HowellResponse<PagedList<Server>>
    >(ServersUrl.list(), params)
  }
  Sync(serverId: string) {
    return this.requestService.post<HowellResponse<string>>(
      ServersUrl.sync(serverId)
    )
  }
  Divisions(serverId: string, params: GetDivisionsParams) {
    return this.requestService.post<
      GetDivisionsParams,
      HowellResponse<Division>
    >(ServersUrl.divisions(serverId), params)
  }
  GarbageStations(serverId: string, params: GetGarbageStationsParams) {
    return this.requestService.post<
      GetDivisionsParams,
      HowellResponse<GarbageStation>
    >(ServersUrl.garbageStations(serverId), params)
  }
  Pictures(serviceId: string, pictureId: string) {
    return ServersUrl.pictures(serviceId, pictureId)
  }

  private _picture?: PictureRequestService
  public get picture(): PictureRequestService {
    if (!this._picture) {
      this._picture = new PictureRequestService(this.requestService)
    }
    return this._picture
  }
}

export class PictureRequestService {
  constructor(private http: HowellAuthHttp) {}

  jpg(pictureId: string, serverId?: string) {
    let url = ServerPictureUrl.jpg(pictureId, serverId)
    return this.http.get(url)
  }
  data(pictureId: string, serverId?: string) {
    let url = ServerPictureUrl.data(pictureId, serverId)
    return this.http.get(url)
  }
  upload(data: string, serverId?: string) {
    console.log(data)
    let url = ServerPictureUrl.basic(serverId)
    return this.http.post<string, PictureUrl>(url, data, {
      'Content-Type': 'application/json-patch+json',
    })
  }
}
