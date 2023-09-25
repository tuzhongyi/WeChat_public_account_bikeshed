import { HowellAuthHttp } from '../../../data-core/repuest/howell-auth-http'
import { HowellHttpClient } from '../../../data-core/repuest/http-client'
import { Service } from '../../../data-core/repuest/service'
import { DaPuQiaoHandleHtmlController } from '../dapuqiao_handle/controllers/dapuqiao_handle_html.controller'
import { DaPuQiaoHandle } from '../dapuqiao_handle/dapuqiao_handle'

export namespace DaPuQiaoIndexPage {
  enum PageIndex {
    handle,
    history,
    user,
  }

  interface ItemHtml<IHtml, IController> {
    html: IHtml
    controller: IController
  }

  export class Page {
    element = {
      main: document.querySelector('.main') as HTMLDivElement,
      items: document.querySelectorAll('.bar-item'),
    }
    index = PageIndex.handle
    constructor(private service: Service) {
      this.items = this.getItems()
    }

    items: {
      handle: ItemHtml<DaPuQiaoHandleHtmlController, DaPuQiaoHandle.Controller>
    }

    parser = new DOMParser()

    getItems() {
      let page = new DaPuQiaoHandleHtmlController()
      return {
        handle: {
          html: page,
          controller: new DaPuQiaoHandle.Controller(page, this.service),
        },
      }
    }

    init() {
      let that = this
      // 绑定点击事件
      for (let i = 0; i < this.element.items.length; i++) {
        const item = this.element.items[i] as HTMLLinkElement
        item.onclick = function () {
          let _this = this as HTMLLinkElement
          try {
            let selected = document.querySelector('.selected')
            if (selected) {
              selected.classList.remove('selected')
            }

            that.element.main.appendChild(that.items.handle.html.element.main)
            that.items.handle.controller.init()
            _this.classList.add('selected')
          } finally {
            return false
          }
        }
      }
      ;(this.element.items[this.index] as HTMLLinkElement).click()
    }

    private get params() {
      let url = window.location.toString()
      let index = url.indexOf('?')
      let params = ''
      if (index > 0) {
        params = url.substring(index)
      }
      return params
    }
  }

  const client = new HowellHttpClient.HttpClient()
  client.login((http: HowellAuthHttp) => {
    var service = new Service(http)
    let page = new DaPuQiaoIndexPage.Page(service)
    page.init()
  })
}
