import { classToPlain, plainToClass } from 'class-transformer'
import { GarbageDropEventRecord } from '../../../data-core/model/waste-regulation/event-record'
import { Service } from '../../../data-core/repuest/service'
import { Tool } from '../../ts/tools/tool'
import { DaPuQiaoHandleModel } from './dapuqiao_handle.model'

export class DaPuQiaoHandleConverter {
  constructor(private service: Service) {}
  convert(input: GarbageDropEventRecord) {
    let plain = classToPlain(input)
    let model = plainToClass(DaPuQiaoHandleModel, plain)
    model.GarbageStation = this.service.garbageStation.get(model.Data.StationId)
    model.LevelTime = input.Data.DropTime
    if (input.Data.SuperVisionData) {
      switch (input.Data.SuperVisionData.Level) {
        case 1:
          if (input.Data.SuperVisionData.Level1Time) {
            model.LevelTime = input.Data.SuperVisionData.Level1Time
          }
          break
        case 2:
          if (input.Data.SuperVisionData.Level2Time) {
            model.LevelTime = input.Data.SuperVisionData.Level2Time
          }
          break
        case 3:
          if (input.Data.SuperVisionData.Level3Time) {
            model.LevelTime = input.Data.SuperVisionData.Level3Time
          }
          break
        default:
          break
      }
    }
    model.Minutes = input.Data.TakeMinutes
    if (!model.Minutes) {
      model.Minutes =
        (new Date().getTime() - input.Data.DropTime.getTime()) / (1000 * 60)
    }
    if (!input.Data.IsHandle) {
      model.Distance = new Promise<string>((resolve) => {
        if (input.Data.GisPoint) {
          this.service.wechat_api
            .getLocation()
            .then((location) => {
              let distance = Tool.getDistance(
                location[1],
                location[0],
                input.Data.GisPoint!.Latitude,
                input.Data.GisPoint!.Longitude
              )

              if (distance < 1) {
                resolve(`${Math.round(distance / 1000)}m`)
              } else {
                resolve(`${distance.toFixed(2)}km`)
              }
            })
            .catch((x) => {
              resolve('')
            })
        }
      })
    }

    return model
  }
}
