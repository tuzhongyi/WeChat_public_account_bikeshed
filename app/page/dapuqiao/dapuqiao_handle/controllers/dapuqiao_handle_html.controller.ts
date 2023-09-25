import { MessageData } from '../../../../data-core/model/message-data.model'
import { DaPuQiaoHandleDetailsCommand } from '../../dapuqiao_handle_details/dapuqiao_handle_details.model'

interface DaPuQiaoHandleHtmlElement {
  main: HTMLDivElement
  tab: {
    feedbacked: HTMLDivElement
    handled: HTMLDivElement
  }
  search: {
    input: HTMLInputElement
    button: HTMLElement
  }
  swiper: {
    image: HTMLDivElement
    details: HTMLDivElement
  }
  content: HTMLDivElement
}

export class DaPuQiaoHandleHtmlController {
  private parser = new DOMParser()
  private document: Document
  constructor() {
    this.document = this.parser.parseFromString(this.template.main, 'text/html')
    this.regist()
  }

  private regist() {
    window.addEventListener('message', this.onmessage.bind(this))
  }

  private onmessage(e: MessageEvent<MessageData>) {
    if (e && e.data) {
      let data: MessageData = { command: '', index: '0' }
      try {
        if (typeof e.data === 'string') {
          data = JSON.parse(e.data)
        } else {
          data = e.data
        }
      } catch (error) {
        console.warn(error, e)
      }
      switch (data.command) {
        case DaPuQiaoHandleDetailsCommand.ondetails:
          if (this.event.details_ok) {
            let value = data.value ? parseInt(data.value) : 0
            this.event.details_ok(value)
          }
          break
        default:
          break
      }
    }
  }

  event: {
    details_ok?: (value: number) => Promise<void>
  } = {}

  private _element?: DaPuQiaoHandleHtmlElement
  get element() {
    if (!this._element) {
      let result = {
        main: this.document.querySelector(
          '.dapuqiao_handle-container'
        ) as HTMLDivElement,
        tab: {
          feedbacked: this.document.querySelector(
            '.tab.feedbacked'
          ) as HTMLDivElement,
          handled: this.document.querySelector(
            '.tab.handled'
          ) as HTMLDivElement,
        },
        search: {
          input: this.document.querySelector(
            '#searchInput'
          ) as HTMLInputElement,
          button: this.document.querySelector('#btn_search') as HTMLElement,
        },
        swiper: {
          image: this.document.querySelector('#origin-img') as HTMLDivElement,
          details: this.document.querySelector(
            '#details-container'
          ) as HTMLDivElement,
        },
        content: this.document.querySelector(
          '.dapuqiao_handle-container-body-content'
        ) as HTMLDivElement,
      }
      this._element = result
    }

    return this._element
  }
  private template = {
    event: `
    <div class="dapuqiao_handle-container-body-content-item">
      <div class="item">
        <div class="item-head">
          <div class="station-name">国定路700弄</div>
          <div class="labels">
            <div class="label had ishandle"><div>已处置</div></div>
            <div class="label had isfeedback"><div>已反馈</div></div>
            <div class="label level">三级事件</div>
          </div>          
        </div>
        <div class="item-body">
          <div class="imgs">
          </div>
        </div>
        <div class="item-food">
          <div class="time">13:13:13</div>
          <div class="distance"></div>
          <div class="duration">
            <div class="minutes">1分钟</div>
          </div>
        </div>
        <div class="item-buttons">
          <div class="item-button">处置事件</div>
        </div>
      </div>
    </div>`,
    main: `<div class="dapuqiao_handle-container">
    <div class="dapuqiao_handle-container-head">
      <div class="dapuqiao_handle-container-head-content">
        <header>
          <div class="header-item search" id="searchBar">
            <input type="search" id="searchInput" placeholder="搜索" />
            <i id="btn_search" class="howell-icon-search"></i>
          </div>
          <div class="header-item">
            <div class="header-item__btn" id="filter">
              <span><i class="howell-icon-screen"></i>筛选</span>
            </div>
          </div>
        </header>
        <header class="head-handle">
          <div class="header-item feedbacked tab">
            <div>已反馈</div>
          </div>
          <div class="header-item handled tab">
            <div>已处置</div>
          </div>
        </header>
      </div>
    </div>
    <div class="dapuqiao_handle-container-body minirefresh-wrap" id="content">
      <div class="dapuqiao_handle-container-body-content"></div>
    </div>

    <div class="details-container" id="details-container">      
    </div>
    <div class="swiper-container" id="origin-img">
      <div class="swiper-wrapper"></div>
      <div class="swiper-pagination"></div>
    </div>
  </div>`,
  }

  getHandleTemplate() {
    let template = this.parser.parseFromString(this.template.event, 'text/html')
    let imgs = template.querySelector('.imgs') as HTMLDivElement
    imgs.innerHTML = ''
    return {
      item: template.querySelector(
        '.dapuqiao_handle-container-body-content-item'
      ) as HTMLDivElement,
      stationName: template.querySelector('.station-name') as HTMLDivElement,
      label: {
        level: template.querySelector('.label.level') as HTMLDivElement,
        ishandle: template.querySelector('.label.ishandle') as HTMLDivElement,
        isfeedback: template.querySelector(
          '.label.isfeedback'
        ) as HTMLDivElement,
      },
      imgs: imgs,
      duration: template.querySelector('.duration') as HTMLDivElement,
      distance: template.querySelector('.distance') as HTMLDivElement,
      time: template.querySelector('.time') as HTMLDivElement,
      minutes: template.querySelector('.minutes') as HTMLDivElement,
      button: template.querySelector('.item-button') as HTMLDivElement,
    }
  }
  getHTML() {
    let template = this.parser.parseFromString(this.template.main, 'text/html')
    return template.querySelector('dapuqiao_handle-container') as HTMLDivElement
  }
  clean() {
    this.element.content.innerHTML = ''
  }
}
