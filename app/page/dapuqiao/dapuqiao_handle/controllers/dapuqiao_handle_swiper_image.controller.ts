import $ from 'jquery'
import Swiper from 'swiper'
import { CameraImageUrl } from '../../../../data-core/model/waste-regulation/event-record'
import { Service } from '../../../../data-core/repuest/service'
import { DaPuQiaoHandleHtmlController } from './dapuqiao_handle_html.controller'

export class DaPuQiaoHandleSwiperImageController {
  constructor(
    private html: DaPuQiaoHandleHtmlController,
    private service: Service
  ) {
    this.regist()
  }
  swiper?: Swiper
  status: boolean = false

  create(imageUrl: CameraImageUrl) {
    let container = document.createElement('div')
    container.className = 'swiper-zoom-container'

    let img = document.createElement('img')
    img.src = this.service.picture(imageUrl.ImageUrl)
    container.appendChild(img)

    return container
  }
  show(imgs: CameraImageUrl[], index: number) {
    $(this.html.element.swiper.image).fadeIn()
    if (!this.swiper) {
      let inited = false
      this.swiper = new Swiper(this.html.element.swiper.image, {
        virtual: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
        },
        on: {
          slideChange: (swiper: Swiper) => {
            if (inited == false) return
          },
        },
      })
    }
    this.swiper.virtual.removeAllSlides()
    this.swiper.virtual.cache = []
    for (let i = 0; i < imgs.length; i++) {
      let container = this.create(imgs[i])

      this.swiper.virtual.appendSlide(container.outerHTML)

      // this.swiper.virtual.appendSlide('<div class="swiper-zoom-container">' +
      //   '<div><a onclick="return false"><i class="howell-icon-real-play"></i></a></div>'
      //   + '<img src="' + url +
      //   '" /></div>');
    }
    this.swiper.slideTo(index, 0)
  }

  regist() {
    this.html.element.swiper.image.addEventListener('click', (e) => {
      let path = ((e.composedPath && e.composedPath()) ||
        e.path) as HTMLElement[]
      if (path) {
        for (let i = 0; i < path.length; i++) {
          // if (path[i].className == "video-control") {
          //   this.onPlayControlClicked(element.imageUrls![this.swiper!.activeIndex], path[i] as HTMLDivElement);
          //   return;
          // }
          if (path[i].className == 'tools') {
            e.stopPropagation()
            return
          }
        }
      }

      $(this.html.element.swiper.image).fadeOut()
      this.status = false
    })
  }
}
