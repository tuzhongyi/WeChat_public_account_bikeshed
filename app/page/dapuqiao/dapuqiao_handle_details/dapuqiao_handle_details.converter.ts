import { classToPlain, plainToClass } from 'class-transformer'
import { GarbageDropEventRecord } from '../../../data-core/model/waste-regulation/event-record'
import { Service } from '../../../data-core/repuest/service'
import { Tool } from '../../ts/tools/tool'
import { DaPuQiaoHandleDetailsModel } from './dapuqiao_handle_details.model'

export class DaPuQiaoHandleDetailsConverter {
  constructor(private service: Service) {}
  convert(input: GarbageDropEventRecord, userId?: string) {
    let plain = classToPlain(input)
    let model = plainToClass(DaPuQiaoHandleDetailsModel, plain)
    model.GarbageStation = this.service.garbageStation.get(input.Data.StationId)
    model.Minutes = input.Data.TakeMinutes
    if (!model.Minutes) {
      model.Minutes =
        (new Date().getTime() - input.Data.DropTime.getTime()) / (1000 * 60)
    }
    if (input.Data.Feedbacks && userId) {
      model.Feedback =
        input.Data.Feedbacks?.find((x) => x.FeedbackUserId === userId) ??
        undefined
    }

    model.Distance = new Promise<number | undefined>((resolve) => {
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
            resolve(distance / 1000)
          })
          .catch((x) => {
            resolve(undefined)
          })
      }
    })

    return model
  }
}
