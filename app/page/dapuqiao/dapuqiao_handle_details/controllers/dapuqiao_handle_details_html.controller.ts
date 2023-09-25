interface DaPuQiaoHandleDetailsHtmlElement {
  main: HTMLDivElement
  station: HTMLDivElement
  community: HTMLDivElement
  address: HTMLDivElement
  time: HTMLDivElement
  duration: HTMLDivElement
  result: {
    select: HTMLSelectElement
    span: HTMLSpanElement
  }
  description: HTMLInputElement
  button: HTMLDivElement
  img: {
    plus: HTMLDivElement
    list: HTMLDivElement
  }
}

export class DaPuQiaoHandleDetailsHtmlController {
  constructor() {
    this.document = this.parser.parseFromString(this.template.main, 'text/html')
    this.regist()
  }

  document: Document
  private parser = new DOMParser()

  regist() {
    this.element.img.plus.addEventListener('click', () => {
      if (this.event && this.event.img && this.event.img.plus) {
        this.event.img.plus()
      }
    })
    this.element.button.addEventListener('click', () => {
      if (this.event.ok) {
        this.event.ok().then((x) => {
          if (this.output.ok) {
            this.output.ok(x)
          }
        })
      } else {
        if (this.output.ok) {
          this.output.ok(false)
        }
      }
    })
  }

  output: {
    ok?: (args: boolean) => Promise<void>
  } = {}

  event: {
    img: {
      plus?: () => Promise<void>
    }
    ok?: () => Promise<boolean>
  } = {
    img: {},
  }

  private _element?: DaPuQiaoHandleDetailsHtmlElement
  get element() {
    if (!this._element) {
      this._element = {
        main: this.document.querySelector(
          '.dapuqiao_details_container'
        ) as HTMLDivElement,
        station: this.document.querySelector('#station') as HTMLDivElement,
        community: this.document.querySelector('#community') as HTMLDivElement,
        address: this.document.querySelector('#address') as HTMLDivElement,
        time: this.document.querySelector('#time') as HTMLDivElement,
        duration: this.document.querySelector('#duration') as HTMLDivElement,
        result: {
          select: this.document.querySelector(
            '#result-select'
          ) as HTMLSelectElement,
          span: this.document.querySelector('#result-span') as HTMLSpanElement,
        },
        description: this.document.querySelector(
          '#description'
        ) as HTMLInputElement,
        button: this.document.querySelector(
          '.handle-details-button'
        ) as HTMLDivElement,
        img: {
          plus: this.document.querySelector('.img-plus') as HTMLDivElement,
          list: this.document.querySelector('.images-list') as HTMLDivElement,
        },
      }
    }
    return this._element
  }

  template = {
    main: `<div class="dapuqiao_details_container">
    <div class="dapuqiao_details_container-body">
      <div class="dapuqiao_details_container-body-content">
        <div class="dapuqiao_details_container-body-content-items">
          <div class="dapuqiao_details_container-body-content-item">
            <div class="dapuqiao_details_container-body-content-item-title">投放点</div>
            <div class="dapuqiao_details_container-body-content-item-value" id="station"></div>
          </div>
          <div class="dapuqiao_details_container-body-content-item">
            <div class="dapuqiao_details_container-body-content-item-title">社区</div>
            <div
              class="dapuqiao_details_container-body-content-item-value"
              id="community"
            ></div>
          </div>
          <div class="dapuqiao_details_container-body-content-item">
            <div class="dapuqiao_details_container-body-content-item-title">地址</div>
            <div class="dapuqiao_details_container-body-content-item-value" id="address"></div>
          </div>
          <div class="dapuqiao_details_container-body-content-item">
            <div class="dapuqiao_details_container-body-content-item-title">上报时间</div>
            <div class="dapuqiao_details_container-body-content-item-value" id="time"></div>
          </div>
          <div class="dapuqiao_details_container-body-content-item">
            <div class="dapuqiao_details_container-body-content-item-title">滞留时长</div>
            <div
              class="dapuqiao_details_container-body-content-item-value"
              id="duration"
            ></div>
          </div>
          <div class="dapuqiao_details_container-body-content-item">
            <div class="dapuqiao_details_container-body-content-item-title">处置结果</div>
            <div class="dapuqiao_details_container-body-content-item-value">
              <select id="result-select" style="display: none">
                <option value="1">已处置</option>
                <option value="2">误报</option>
                <option value="3">管理不规范</option>
              </select>
              <span id="result-span" style="display: none"></span>
            </div>
          </div>
          <div class="dapuqiao_details_container-body-content-item">
            <div class="dapuqiao_details_container-body-content-item-title">备注</div>
            <div class="dapuqiao_details_container-body-content-item-value">
              <input type="text" id="description" />
            </div>
          </div>
          <div class="dapuqiao_details_container-body-content-images">
            <div class="images-head">事件处理照片</div>
            <div class="images-list">
              
              <div class="img-plus">
                <i class="howell-icon-plus"></i>
              </div>
            </div>
          </div>
          <div class="error"></div>
        </div>
        <div class="dapuqiao_details_container-body-content-buttons">
          <div class="handle-details-button">确认</div>
        </div>
      </div>
    </div>
  </div>`,
    image: {
      item: `<div class="img-item"><div class="img-item-del"><i class="howell-icon-Close"></i></div></div>`,
    },
  }
}
