import { SessionUser } from '../../../common/session-user'
import { PictureUrl } from '../../../data-core/model/picture-url.model'
import { GarbageFeedbackParams } from '../../../data-core/model/waste-regulation/event-record-params'
import { Service } from '../../../data-core/repuest/service'
import { Language } from '../../ts/language'
import { DaPuQiaoHandleDetailsHtmlController } from './controllers/dapuqiao_handle_details_html.controller'
import { DaPuQiaoHandleDetailsConverter } from './dapuqiao_handle_details.converter'
import './dapuqiao_handle_details.less'
import {
  DaPuQiaoHandleDetailsModel,
  IDaPuQiaoHandleDetailsImage,
} from './dapuqiao_handle_details.model'

export namespace DaPuQiaoHandleDetails {
  export class Controller {
    constructor(
      private html: DaPuQiaoHandleDetailsHtmlController,
      private service: Service
    ) {
      this.converter = new DaPuQiaoHandleDetailsConverter(service)
    }

    converter: DaPuQiaoHandleDetailsConverter
    session = new SessionUser()
    model?: DaPuQiaoHandleDetailsModel
    event: {
      ok?: () => {}
    } = {}
    issubmit = false
    regist(model: DaPuQiaoHandleDetailsModel) {
      this.html.event.ok = async () => {
        return new Promise<boolean>((resolve) => {
          if (model.Data.IsHandle) {
            resolve(false)
            return
          }
          if (model.Feedback) {
            resolve(false)
            return
          }

          model.Distance.then((distance) => {
            this.submit(model.EventId!, model.Images, distance).then((x) =>
              resolve(x)
            )
          }).catch((x) => {
            if (model.Data.IsHandle) {
              return
            }
            this.submit(model.EventId!, model.Images).then((x) => resolve(x))
          })
        })
      }

      this.html.event.img.plus = async () => {
        this.service.wechat_api.chooseImage().then((localIds) => {
          let urls = []
          for (let i = 0; i < localIds.length; i++) {
            const id = localIds[i]
            urls.push(this.service.wechat_api.getLocalImgData(id))
          }
          model.Images = [...model.Images, ...urls]
          Promise.all(model.Images).then((urls) => {
            this.tohtml_images_create(urls)
          })
        })
      }
    }

    submit(
      eventId: string,
      images: Promise<IDaPuQiaoHandleDetailsImage>[],
      distance?: number
    ) {
      return new Promise<boolean>(async (resolve) => {
        let params = new GarbageFeedbackParams()
        params.FeedbackUserId = this.session.WUser.Id!
        params.FeedbackUserName = this.session.WUser.LastName!
        params.FeedbackDistance = distance
        params.FeedbackUserMobileNo = this.session.WUser.MobileNo
        params.FeedbackUserType = this.session.WUser.UserType!
        params.FeedbackResult = parseInt(this.html.element.result.select.value)
        params.FeedbackDescription = this.html.element.description.value

        if (images && images.length > 0) {
          let all = images.map((img) => {
            return new Promise<PictureUrl>((resolve) => {
              img.then((img) => {
                let base64 = img.data
                let index = img.data.indexOf('base64')

                if (index >= 0) {
                  base64 = img.data.substring(index + 7)
                }
                this.service.server.picture
                  .upload(`"${base64}"`, this.session.WUser.ServerId)
                  .then((url) => {
                    resolve(url)
                  })
              })
            })
          })
          params.FeedbackImageUrls = (await Promise.all(all)).map((x) => x.Id!)
          params.FeedbackImageUrls = params.FeedbackImageUrls.filter((x) => !!x)
        }

        this.service.event.record.garbageDrop
          .feedback(eventId, params)
          .then((x) => {
            resolve(x.Data.FeedbackState === 1)
          })
          .catch((x) => {
            resolve(false)
          })
      })
    }

    async init(eventId: string) {
      this.model = await this.load(eventId)
      this.regist(this.model)
    }

    async load(eventId: string) {
      let data = await this.getData(eventId)

      let model = this.converter.convert(data, this.session.WUser.Id)
      this.tohtml(model)
      return model
    }

    tohtml(model: DaPuQiaoHandleDetailsModel) {
      this.html.element.station.innerHTML = model.Data.StationName
      this.html.element.community.innerHTML = model.Data.CommunityName ?? '-'
      model.GarbageStation.then((x) => {
        this.html.element.address.innerHTML = x.Address ?? '-'
      })
      this.html.element.time.innerHTML = model.Data.DropTime.format(
        'yyyy-MM-dd HH:mm:ss'
      )
      this.html.element.duration.innerHTML = Language.Time(model.Minutes) ?? '-'
      if (model.Feedback) {
        this.html.element.description.value =
          model.Feedback.FeedbackDescription ?? '-'
      }
      if (model.Data.IsHandle) {
        this.tohtml_images(model)
      } else {
        this.html.element.img.list.innerHTML = ''
        this.html.element.img.list.appendChild(this.html.element.img.plus)
      }
      this.tohtml_feedback(model)
    }
    tohtml_images(model: DaPuQiaoHandleDetailsModel) {
      this.html.element.img.list.innerHTML = ''
      if (model.Feedback && model.Feedback.FeedbackImageUrls) {
        for (let i = 0; i < model.Feedback.FeedbackImageUrls.length; i++) {
          const url = model.Feedback.FeedbackImageUrls[i]
          let item = document.createElement('div')
          item.className = 'img-item'
          item.style.backgroundImage = `url(${this.service.picture(url)})`
          this.html.element.img.list.appendChild(item)
        }
      }
    }
    tohtml_images_create(images: IDaPuQiaoHandleDetailsImage[]) {
      let that = this
      this.html.element.img.list.innerHTML = ''
      this.html.element.img.list.appendChild(this.html.element.img.plus)
      for (let i = 0; i < images.length; i++) {
        const url = images[i]
        let item = document.createElement('div')
        item.className = 'img-item'
        item.style.backgroundImage = `url(${
          url.data.indexOf('base64') >= 0 ? '' : 'data:image/jpg;base64,'
        }${url.data})`
        item.id = `img_${url.id}`
        let del = document.createElement('div')
        del.innerHTML = "<i class='howell-icon-Close'></i>"
        del.id = url.id
        del.className = 'img-item-del'
        del.onclick = async function () {
          if (that.model) {
            let _this = this as HTMLDivElement
            let images = await Promise.all(that.model.Images)
            let index = images.findIndex((x) => x.id == _this.id)
            that.model.Images.splice(index, 1)
            _this.parentElement?.parentElement?.removeChild(_this.parentElement)
          }
        }
        item.appendChild(del)

        this.html.element.img.list.appendChild(item)
        this.html.element.img.list.insertBefore(
          item,
          this.html.element.img.plus
        )
      }
    }

    tohtml_feedback(model: DaPuQiaoHandleDetailsModel) {
      this.html.element.result.select.style.display = 'none'
      this.html.element.result.span.style.display = 'none'
      if (model.Data.IsHandle) {
        this.html.element.result.span.style.display = 'block'
      } else {
        this.html.element.result.select.style.display = 'block'
      }

      if (model.Feedback) {
        if (model.Data.IsHandle) {
          this.html.element.result.span.innerHTML = Language.FeedbackResult(
            model.Feedback.FeedbackResult
          )
        } else {
          this.html.element.result.select.value =
            model.Feedback.FeedbackResult.toString()
        }
      }
    }

    getData(eventId: string) {
      return this.service.event.record.garbageDrop.get(eventId)
    }

    getParams() {
      let search = window.location.search.substring(1)
      let params = search.split('&')
      let result: { [key: string]: string } = {}
      for (let i = 0; i < params.length; i++) {
        let keyvalue = params[i].split('=')
        result[keyvalue[0].toLowerCase()] = keyvalue[1]
      }
      return result
    }
  }

  // const client = new HowellHttpClient.HttpClient()
  // client.login((http: HowellAuthHttp) => {
  //   var service = new Service(http)
  //   let page = new DaPuQiaoHandleDetailsHtmlController()
  //   let controller = new Controller(page, service)
  //   controller.init()
  // })
}
