import Swiper from 'swiper'
import {
  GetDivisionsParams,
  GetGarbageStationsParams,
} from '../../../data-core/model/server'
import { UserLabel, UserLabelType } from '../../../data-core/model/user-stystem'
import { Camera } from '../../../data-core/model/waste-regulation/camera'
import { Division } from '../../../data-core/model/waste-regulation/division'
import { EventTask } from '../../../data-core/model/waste-regulation/event-task'
import {
  Flags,
  GarbageStation,
  StationState,
} from '../../../data-core/model/waste-regulation/garbage-station'
import { GarbageStationNumberStatistic } from '../../../data-core/model/waste-regulation/garbage-station-number-statistic'
import { VideoUrl } from '../../../data-core/model/waste-regulation/video-model'
import { Service } from '../../../data-core/repuest/service'
import { ViewModelConverter } from './ViewModelConverter'

export interface IImageUrl {
  cameraId: string
  url: string
  cameraName?: string
  preview?: Promise<VideoUrl>
  playback?: Promise<VideoUrl>
}

export interface IPictureController {
  post: (data: string) => Promise<string>
  get: (id: string) => string
}

export interface IActiveElement {
  Element: HTMLDivElement
  id: string
  divisionId: string
  imageUrls: Array<IImageUrl>
  state: Flags<StationState>
  swiper?: Swiper
}

//#region Division
export abstract class DivisionViewModel extends Division {
  constructor(service: Service) {
    super()
    this.service = service
    this.DivisionType
  }
  protected service: Service
  async getGarbageStations() {
    let params = new GetGarbageStationsParams()
    params.DivisionId = this.Id
    let promise = await this.service.garbageStation.list(params)
    return promise.Data.map((x) => {
      return ViewModelConverter.Convert(this.service, x)
    })
  }
}

export class CountyViewModel extends DivisionViewModel {
  constructor(service: Service) {
    super(service)
  }

  async getCommittees() {
    let params = new GetDivisionsParams()
    params.ParentId = this.Id
    let list = await this.service.division.list(params)
    return list.Data.map((x) => {
      return ViewModelConverter.Convert(this.service, x)
    })
  }
}

export class CommitteesViewModel extends DivisionViewModel {
  constructor(service: Service) {
    super(service)
  }
}
//#endregion

//#region GarbageStation
export class GarbageStationViewModel extends GarbageStation {
  constructor(service: Service) {
    super()
    this.service = service
  }
  private service: Service

  NumberStatistic?: GarbageStationNumberStatistic

  private userLabel?: UserLabel
  get UserLabel() {
    return this.userLabel
  }
  set UserLabel(val: UserLabel | undefined) {
    this.userLabel = val
    if (this.onUserLabelChanged) {
      this.onUserLabelChanged(this.userLabel)
    }
  }

  onUserLabelChanged?: (label?: UserLabel) => void

  getNumberStatistic() {
    return this.service.garbageStation.statisticNumber(this.Id)
  }

  getUserLabel() {
    return this.service.user.label.get(this.Id, UserLabelType.garbageStation)
  }
  async getDivision() {
    if (this.DivisionId) {
      let item = await this.service.division.get(this.DivisionId)
      return ViewModelConverter.Convert(this.service, item)
    }
  }

  async getCameras() {
    let list = await this.service.camera.list(this.Id)
    return list.map((x) => {
      return ViewModelConverter.Convert(this.service, x)
    })
  }
}
//#endregion

//#region Camera
export class CameraViewModel extends Camera {
  static readonly defaultImageUrl =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABIAAAAKIAQAAAAAgULygAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAd2KE6QAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAHdElNRQflAgIBCxpFwPH8AAAAcklEQVR42u3BMQEAAADCoPVPbQZ/oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+A28XAAEDwmj2AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAyLTAyVDAxOjExOjI2KzAwOjAwOo9+nAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMi0wMlQwMToxMToyNiswMDowMEvSxiAAAAAASUVORK5CYII='
  constructor(service: Service) {
    super()
    this.service = service
  }
  private service: Service
  getImageUrl() {
    if (this.ImageUrl) {
      return this.service.picture(this.ImageUrl)
    } else {
      return CameraViewModel.defaultImageUrl
    }
  }
  getPreviewUrl() {
    return this.service.sr.PreviewUrls({
      CameraId: this.Id,
      Protocol: 'ws-ps',
      StreamType: 1,
    })
  }
  getVodUrl(begin: Date, end: Date) {
    return this.service.sr.VodUrls({
      CameraId: this.Id,
      StreamType: 1,
      Protocol: 'ws-ps',
      BeginTime: begin.toISOString(),
      EndTime: end.toISOString(),
    })
  }
}
//#endregion

//#region EventTask
export class EventTaskViewModel extends EventTask {
  constructor(service: Service) {
    super()
    this.service = service
  }
  private service: Service

  private division?: Division

  async getDivision() {
    if (this.division) return this.division
    if (this.DivisionId) {
      this.division = await this.service.division.get(this.DivisionId)
      return this.division
    }
  }
}
//#endregion
