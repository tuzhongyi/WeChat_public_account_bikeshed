import $ from 'jquery'
import { Service } from '../../../../data-core/repuest/service'
import { DaPuQiaoHandleDetailsHtmlController } from '../../dapuqiao_handle_details/controllers/dapuqiao_handle_details_html.controller'
import { DaPuQiaoHandleDetails } from '../../dapuqiao_handle_details/dapuqiao_handle_details'
import { DaPuQiaoHandleHtmlController } from './dapuqiao_handle_html.controller'

export class DaPuQiaoHandleDetailsController {
  constructor(
    private html: DaPuQiaoHandleHtmlController,
    private service: Service
  ) {
    this.regist()
  }

  create() {}

  details_html = new DaPuQiaoHandleDetailsHtmlController()
  details_controller = new DaPuQiaoHandleDetails.Controller(
    this.details_html,
    this.service
  )

  regist() {
    this.details_html.output.ok = async (x: boolean) => {
      if (this.event.ok) {
        this.event.ok(x)
      }
    }
  }

  event: {
    ok?: (x: boolean) => void
  } = {}

  show(id: string) {
    this.html.element.swiper.details.appendChild(this.details_html.element.main)
    this.details_controller.init(id)
    $(this.html.element.swiper.details).fadeIn()
  }
  close() {
    $(this.html.element.swiper.details).fadeOut()
  }
}
