import Swiper, { Pagination, Virtual } from 'swiper'
import 'swiper/components/pagination/pagination.less'
import 'swiper/swiper.less'
import { OrderType } from '../../../data-core/enums/order-type.enum'
import { Page } from '../../../data-core/model/page'
import { GetGarbageDropEventRecordsParams } from '../../../data-core/model/waste-regulation/event-record-params'
import { Service } from '../../../data-core/repuest/service'
import '../../css/header.less'
import { Language } from '../../ts/language'
import { DateTimeTool } from '../../ts/tools/datetime.tool'
import { DaPuQiaoHandleDetailsController } from './controllers/dapuqiao_handle_details.controller'
import { DaPuQiaoHandleHtmlController } from './controllers/dapuqiao_handle_html.controller'
import { DaPuQiaoHandleMiniRefreshController } from './controllers/dapuqiao_handle_minirefresh.controller'
import { DaPuQiaoHandleSwiperImageController } from './controllers/dapuqiao_handle_swiper_image.controller'
import { DaPuQiaoHandleConverter } from './dapuqiao_handle.converter'
import './dapuqiao_handle.less'
import {
  DaPuQiaoHandleArgs,
  DaPuQiaoHandleModel,
} from './dapuqiao_handle.model'

Swiper.use([Virtual, Pagination])

export namespace DaPuQiaoHandle {
  export class Controller {
    args = new DaPuQiaoHandleArgs()
    page?: Page
    datas: DaPuQiaoHandleModel[] = []
    refresh?: DaPuQiaoHandleMiniRefreshController
    image: DaPuQiaoHandleSwiperImageController
    details: DaPuQiaoHandleDetailsController
    converter: DaPuQiaoHandleConverter
    constructor(
      private html: DaPuQiaoHandleHtmlController,
      private service: Service
    ) {
      this.image = new DaPuQiaoHandleSwiperImageController(html, service)
      this.details = new DaPuQiaoHandleDetailsController(html, service)
      this.converter = new DaPuQiaoHandleConverter(service)
    }

    init() {
      this.html.element.tab.feedbacked.addEventListener('click', (e: any) => {
        if (this.html.element.tab.feedbacked.classList.contains('selected')) {
          this.html.element.tab.feedbacked.classList.remove('selected')
          this.args.isFeedback = false
        } else {
          this.html.element.tab.feedbacked.classList.add('selected')
          this.args.isFeedback = true
        }
        this.refresh?.trigger()
      })
      this.html.element.tab.handled.addEventListener('click', (e: any) => {
        if (this.html.element.tab.handled.classList.contains('selected')) {
          this.html.element.tab.handled.classList.remove('selected')
          this.args.isHandle = false
        } else {
          this.html.element.tab.handled.classList.add('selected')
          this.args.isHandle = true
        }
        this.refresh?.trigger()
      })
      this.html.element.search.button.addEventListener('click', (e: any) => {
        this.args.name = this.html.element.search.input.value
        this.refresh?.trigger()
      })

      this.details.event.ok = async (x) => {
        if (x) {
          this.refresh?.trigger()
        }
        this.details.close()
      }

      this.initRefresh()
    }

    initRefresh() {
      this.refresh = new DaPuQiaoHandleMiniRefreshController({
        id: 'content',
        down: async () => {
          return new Promise<void>((resolve) => {
            this.clean()
            let promise = this.load(1)
            resolve(promise)
          })
        },
        up: async () => {
          return new Promise<boolean>((resolve) => {
            if (
              !this.page ||
              this.page.PageCount === 0 ||
              this.page.PageIndex >= this.page.PageCount
            ) {
              resolve(true)
              return
            }
            let index = this.page.PageIndex + 1
            this.load(index).then(() => {
              if (this.page) {
                resolve(this.page.PageIndex >= this.page.PageCount)
              } else {
                resolve(true)
              }
            })
          })
        },
      })
    }

    clean() {
      this.html.clean()
      this.datas = []
      this.page = undefined
    }

    async load(index: number, size: number = 20) {
      let data = await this.getData(index, size, this.args)
      this.page = data.Page
      let models = data.Data.map((x) => this.converter.convert(x))
      this.datas = [...this.datas, ...models]
      this.tohtml(this.datas)
    }

    tohtml(models: DaPuQiaoHandleModel[]) {
      let _this = this
      for (let i = 0; i < models.length; i++) {
        const model = models[i]
        let template = this.html.getHandleTemplate()
        template.stationName.innerHTML = model.Data.StationName
        template.label.ishandle.style.display = model.Data.IsHandle
          ? ''
          : 'none'
        template.label.isfeedback.style.display =
          model.Data.FeedbackState === 1 ? '' : 'none'
        if (model.Data.SuperVisionData) {
          template.label.level.classList.add(
            `level${model.Data.SuperVisionData.Level}`
          )
          template.label.level.innerHTML = `${Language.Level(
            model.Data.SuperVisionData.Level
          )}事件`

          template.minutes.classList.add(
            `level${model.Data.SuperVisionData.Level}`
          )
          template.minutes.innerHTML = Language.Time(model.Minutes) ?? ''
          template.time.innerHTML = model.LevelTime.format('HH:mm:ss')

          let urls = [
            ...(model.Data.DropImageUrls ?? []),
            ...(model.Data.TimeoutImageUrls ?? []),
            ...(model.Data.HandleImageUrls ?? []),
          ]

          urls.forEach((url, index) => {
            let img = document.createElement('div')
            img.className = 'img'
            img.style.backgroundImage = `url(${this.service.picture(
              url.ImageUrl
            )})`

            img.addEventListener('click', () => {
              this.image.show(urls, index)
            })

            template.imgs.appendChild(img)
          })
        }

        if (model.Distance) {
          model.Distance.then((x) => {
            template.distance.innerHTML = x
          })
        }
        if (model.Data.IsHandle) {
          template.button.innerHTML = '查看事件'
        } else {
          template.button.innerHTML = '处理事件'
        }
        template.button.id = model.EventId ?? model.Id

        template.button.addEventListener('click', function () {
          _this.details.show(this.id)
        })

        this.html.element.content.appendChild(template.item)
      }
    }

    async getData(index: number, size: number, args: DaPuQiaoHandleArgs) {
      let duration = DateTimeTool.allDay(args.date)
      let params: GetGarbageDropEventRecordsParams = {
        BeginTime: duration.begin,
        EndTime: duration.end,
        PageIndex: index,
        PageSize: size,
        StationName: args.name,
        IsHandle: args.isFeedback
          ? args.isHandle
            ? true
            : undefined
          : args.isHandle,
        FeedbackState: args.isHandle
          ? args.isFeedback
            ? 1
            : undefined
          : args.isFeedback
          ? 1
          : 0,
        DropTimeOrderBy: OrderType.Desc,
      }
      return this.service.event.record.garbageDrop.list(params)
    }
  }

  // const client = new HowellHttpClient.HttpClient()
  // client.login((http: HowellAuthHttp) => {
  //   var service = new Service(http)
  //   let page = new DaPuQiaoHandleHtmlController()
  //   let controller = new Controller(page, service)
  //   controller.init()
  // })
}
