import $ from 'jquery'
import Swiper, { Pagination, Virtual } from 'swiper'
import { OnlineStatus } from '../../data-core/model/waste-regulation/camera'
import {
  Flags,
  StationState,
} from '../../data-core/model/waste-regulation/garbage-station'
import { ResourceRole, ResourceType } from '../../data-core/model/we-chat'
import { DataController } from './data-controllers/DataController'
import { Paged } from './data-controllers/IController'
import {
  CameraViewModel,
  GarbageStationViewModel,
  IActiveElement,
  IImageUrl,
} from './data-controllers/ViewModels'
import EchartsAside from './GarbageStationEchartsAside'
import { Language } from './language'
import MyAside, { SelectionMode } from './myAside'

import '../css/header.less'

import 'weui'
import '../css/garbagestations.css'

import 'minirefresh'
import 'minirefresh/dist/debug/minirefresh.css'
import 'swiper/components/pagination/pagination.less'
import 'swiper/swiper.less'

import { getQueryVariable } from '../../common/tool'
import { Page } from '../../data-core/model/page'
import { UserLabel } from '../../data-core/model/user-stystem'
import { VideoPlugin } from './data-controllers/modules/VideoPlugin'
import CreateUserLabelAside from './GarbageStationCreateUserLabel'
import GarbageStationServer from './GarbageStationServer'
import UserLabelAside from './GarbageStationUserLabel'
import IObserver from './IObserver'

// 模块化方式使用 Swiper库
Swiper.use([Virtual, Pagination])

enum ZoomStatus {
  out = 'zoomOut',
  in = 'zoomIn',
}
let slideClassName = 'slideIn'

// 使用简单的观察者模式，实现 GarbageStationClient 和 myAside 类的通信
export default class GarbageStationClient implements IObserver {
  garbageElements: Map<string, any> = new Map() // 保存创建的每个卡片

  zoomStatus: ZoomStatus = ZoomStatus.out // 当前的缩放状态

  swiper: Swiper | null = null // 全屏swiper

  originStatus: boolean = false
  activeIndex?: number
  activeElement?: IActiveElement

  private customElement = document.createElement('div')

  dataController: DataController

  type: ResourceType //当前账号的类型

  garbageStations: GarbageStationViewModel[] = [] //接口请求到的所有数据
  userLabels: UserLabel[] = []

  garbageStationsChunk: GarbageStationViewModel[] = [] //当前请求到的分页数据
  garbageStationsAcc: GarbageStationViewModel[] = [] //累计请求到的数据
  garbageStationsTotal: GarbageStationViewModel[] = [] //满足条件的所有数据
  dropPage: Page | null = null

  eventTypes: Array<string> = []
  roleTypes: Array<string> = [] // 筛选区域

  garbageDropTitle = '垃圾滞留'
  garbageDropState = '999'

  roleList: ResourceRole[] = [] // 侧边栏筛选数据
  myAside: MyAside | null = null // 侧边栏

  myChartAside: EchartsAside | null = null // EChart页

  createFirstFive: boolean = true

  _showAside = false
  get showAside() {
    return this._showAside
  }
  set showAside(val) {
    this._showAside = val
    if (val) {
      if (this.myAside) {
        $(this.elements.container.asideContainer).show()
        setTimeout(() => {
          this.myAside?.slideIn()
        }, 1e2)
      }
    } else {
      setTimeout(() => {
        $(this.elements.container.asideContainer).hide()
      }, 3e2)
    }
  }

  _showChart: boolean = false

  get showChart() {
    return this._showChart
  }
  set showChart(val) {
    this._showChart = val
    if (this.myChartAside) {
      if (val) {
        this.elements.container.chartContainer.classList.add(slideClassName)
      } else {
        this.elements.container.chartContainer.classList.remove(slideClassName)
        this.myChartAside.date = new Date()
      }
    }
  }

  private _showUserLabel: boolean = false
  public get showUserLabel(): boolean {
    return this._showUserLabel
  }
  public set showUserLabel(v: boolean) {
    this._showUserLabel = v
    if (v) {
      this.elements.container.userLabelContainer.classList.add(slideClassName)
    } else {
      this.elements.container.userLabelContainer.classList.remove(
        slideClassName
      )
    }
  }

  elements = {
    count: document.querySelector('#count') as HTMLDivElement,
    container: {
      hwContainer: document.querySelector('#hw-container') as HTMLDivElement,

      chartContainer: document.querySelector<HTMLElement>(
        '#chart-container'
      ) as HTMLDivElement,
      userLabelContainer: document.querySelector<HTMLDivElement>(
        '#user-label-container'
      ) as HTMLDivElement,
      asideContainer: document.querySelector('#aside-container') as HTMLElement,
    },
    btns: {
      imgDivision: document.querySelector('#img_division') as HTMLDivElement,
      btnDivision: document.querySelector('#filter') as HTMLDivElement,
      searchInput: document.querySelector('#searchInput') as HTMLInputElement,
      btnSearch: document.querySelector('#btn_search') as HTMLInputElement,
      imgIcon: document.querySelector('#img_division i') as HTMLElement,
    },
    others: {
      hwBar: document.querySelector('.hw-bar') as HTMLDivElement,
      originImg: document.querySelector('#origin-img') as HTMLDivElement,
      template: document.querySelector('#card-template') as HTMLTemplateElement,
    },
  }

  miniRefresh!: MiniRefresh

  currentPage: Paged = {
    index: 1,
    size: 10,
  }

  searchContent: string = ''

  constructor(
    type: ResourceType,
    dataController: DataController,
    private server: GarbageStationServer
  ) {
    this.type = type
    this.dataController = dataController

    this.miniRefresh = new MiniRefresh({
      container: '#minirefresh',
      down: {
        callback: () => {
          // 下拉事件
          this.miniRefreshDown()
        },
      },
      up: {
        isAuto: false,
        callback: () => {
          this.miniRefreshUp()
        },
      },
    })
  }
  update(args: any) {
    if (args) {
      if ('show' in args) {
        this.showAside = args.show
      }
      if ('showChart' in args) {
        this.showChart = args.showChart
      }
      if ('showUserLabel' in args) {
        this.showUserLabel = args.showUserLabel
        if ('id' in args && 'mode' in args) {
          let a = document.querySelector(`#${args.id}`) as HTMLElement
          switch (args.mode) {
            case 'remove':
              a.classList.remove('has')
              break
            case 'create':
              a.classList.add('has')
              break
            default:
              break
          }
        }
      }
      if ('filtered' in args) {
        this.reset()

        //// console.log('filtered', args.filtered)
        let data: Map<string, Array<string>> = new Map()

        let filtered = args.filtered as Map<string, Set<HTMLElement>>
        for (let [k, v] of filtered) {
          let ids = [...v].map((element) => element.getAttribute('id') || '')
          data.set(k, ids)
        }
        //console.log(data)
        // this.confirmSelect(data);

        if (data.has('role')) {
          this.roleTypes = data.get('role')!
        }
        if (data.has('state')) {
          this.eventTypes = data.get('state')!
        }
      }
    }
  }
  init() {
    let query_eventtype = getQueryVariable('eventtype')

    // 先请求服务器数据，然后本地筛选
    this.server.loadAllData().then(async () => {
      // 触发 minirefreshup

      this.reset({ eventType: query_eventtype })
    })
    // 侧边栏数据仅请求一次
    this.loadAsideData().then(() => {
      this.createAside(query_eventtype)
    })
    this.bindEvents()
  }

  // 下拉刷新重新创建整个页面
  async miniRefreshDown() {
    //console.log('miniRefreshDown');
    // await this.loadAllData();
    this.server.loadAllData().then(() => {
      this.reset()
    })

    this.createAside()
    this.miniRefresh!.endDownLoading()
  }
  async miniRefreshUp() {
    console.log('miniRefreshUp')
    let stop = false

    //console.log('drop page', this.dropPage)
    // 不是第一次请求
    if (this.dropPage) {
      if (this.dropPage.PageIndex >= this.dropPage.PageCount) {
        stop = true
      } else {
        stop = false
        this.currentPage.index++
      }
    }
    if (!stop) {
      this.loadData()
      this.createContent()
      // 在上拉请求更多数据时，不需要重新创建 EChart
      if (!this.myChartAside) {
        this.createChartAside()
      }
    }
    //console.log('stop', stop);
    this.miniRefresh!.endUpLoading(stop)
  }
  async loadAsideData() {
    this.roleList = await this.dataController.getResourceRoleList()
    //// console.log('侧边栏筛选数据', this.roleList)
  }
  reset(params?: { eventType?: string; search?: string }) {
    $(this.elements.others.originImg).hide()
    this.zoomStatus = ZoomStatus.out
    this.elements.btns.imgIcon.className = 'howell-icon-list'
    if (params && params.search) {
      this.elements.btns.searchInput.value = params.search
    } else {
      this.elements.btns.searchInput.value = ''
    }
    this.searchContent = this.elements.btns.searchInput.value

    this.elements.container.hwContainer.innerHTML = ''
    this.currentPage.index = 1

    this.eventTypes = []
    if (params && params.eventType) {
      this.eventTypes.push(params.eventType)
    }
    this.roleTypes = []
    this.garbageStationsAcc = []
    this.myChartAside = null
    this.dropPage = null
    this.miniRefresh!.resetUpLoading() // 会触发一次上拉回调
  }

  loadData() {
    //console.log('load data')

    let res = this.server.fetch(
      this.eventTypes,
      this.roleTypes,
      this.currentPage,
      this.searchContent
    )

    this.garbageStationsChunk = res.Data
    this.garbageStationsTotal = res.TotalData

    this.garbageStationsAcc = [
      ...this.garbageStationsAcc,
      ...this.garbageStationsChunk,
    ]
    this.dropPage = res.Page

    this.elements.count.textContent =
      this.garbageStationsAcc.length + '/' + this.dropPage!.TotalRecordCount
  }

  bindEvents() {
    //console.log('bind event');
    let _this = this
    this.elements.btns.btnDivision.addEventListener('click', () => {
      this.toggle()
    })
    this.elements.btns.imgDivision.addEventListener('click', () => {
      // 在蒙版消失之前，所有按钮不能点击

      if (this.originStatus) return

      if (this.zoomStatus == ZoomStatus.in) {
        this.elements.btns.imgIcon.classList.remove('howell-icon-list2')
        this.elements.btns.imgIcon.classList.add('howell-icon-list')
        this.zoomOut()
      } else {
        this.elements.btns.imgIcon.classList.remove('howell-icon-list')
        this.elements.btns.imgIcon.classList.add('howell-icon-list2')

        this.zoomIn()
      }
      //console.log('当前状态', this.zoomStatus)
    })

    this.elements.btns.searchInput.addEventListener('search', (e) => {
      this.reset({ search: this.elements.btns.searchInput.value })
    })
    this.elements.btns.btnSearch.addEventListener('click', () => {
      this.reset({ search: this.elements.btns.searchInput.value })
    })
    // 用私有变量监听事件
    this.customElement.addEventListener('cat', (e: any) => {
      this.showDetail(
        {
          id: e.detail.id,
          index: e.detail.index,
        },
        (Math.random() * 10) >> 0
      )
    })

    this.elements.others.originImg.addEventListener('click', function (e) {
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

      _this.activeIndex = _this.swiper!.activeIndex
      if (_this.activeElement!.swiper) {
        _this.activeElement!.swiper.slideTo(_this.activeIndex, 0)
      } else {
        ;(
          _this.activeElement!.Element!.querySelector(
            `.swiper-slide:nth-of-type(${_this.activeIndex + 1})`
          ) as HTMLElement
        ).scrollIntoView({
          block: 'nearest',
          behavior: 'auto',
          inline: 'nearest',
        })
      }

      $(this).fadeOut()
      _this.originStatus = false

      if (_this.video) {
        _this.video.destory()
        _this.video = undefined
      }
    })
  }
  async createContent() {
    // await this.createCard(this.garbageStationsChunk.splice(0, 5));
    await this.createCard(this.garbageStationsChunk)
  }
  private async createCard(data: GarbageStationViewModel[]) {
    //console.log('createContent')

    let _this = this
    // 模板内容
    let tempContent = this.elements.others.template?.content as DocumentFragment

    let len = data.length
    for (let i = 0; i < len; i++) {
      const v = data[i]

      // v.StationState = Math.random() * 3 >> 0;

      if (!v.DivisionId) continue
      let info = tempContent.cloneNode(true) as DocumentFragment

      let content_card = info.querySelector(
        '.hw-content__card'
      ) as HTMLDivElement
      content_card.setAttribute('id', v.Id)
      content_card.setAttribute('divisionid', v.DivisionId)
      content_card.dataset['cardname'] = v.Name
      // let promise = v.getUserLabel()
      // promise.then((x) => {
      //         //   if (x.LabelName) content_card.dataset['cardname'] += x.LabelName
      // })

      // 标题
      let title_head = info.querySelector(
        '.content__title__head'
      ) as HTMLDivElement
      //title_head.innerHTML = v.Name

      let name = document.createElement('div')
      name.innerHTML = v.Name
      title_head.appendChild(name)

      let phone = document.createElement('span')
      let a = document.createElement('a')
      let icon = document.createElement('i')
      icon.className = 'glyphicon glyphicon-earphone'
      a.appendChild(icon)
      a.id = `user-label-${v.Id}`
      a.className = 'user-label'
      if (v.UserLabel) {
        a.classList.add('has')
      }
      a.data = v
      a.onclick = (e) => {
        if (!e.target || !e.target.data) {
          return
        }

        let data = e.target.data as GarbageStationViewModel
        let promise = data.getUserLabel()

        promise
          .then((x) => {
            let p = new UserLabelAside(
              this.elements.container.userLabelContainer,
              data,
              this.dataController
            )

            p.init()
            p.add(this)
            this.showUserLabel = true
          })
          .catch((x) => {
            let p = new CreateUserLabelAside(
              this.elements.container.userLabelContainer,
              data,
              this.dataController
            )

            p.init()
            p.add(this)

            this.showUserLabel = true
          })

        e.stopPropagation()
      }
      phone.appendChild(a)
      title_head.appendChild(phone)

      //title_head.innerHTML += `<span><a href='tel:18930169930' style='color:#32b43e;font-size:12px;margin-left:6px' class='glyphicon glyphicon-earphone'></a></span>`

      // 标题状态
      let title_bandage = info.querySelector(
        '.content__title__badage'
      ) as HTMLDivElement

      let currentGarbageTime = v.NumberStatistic!.CurrentGarbageTime! >> 0
      let hour = Math.floor(currentGarbageTime / 60)
      let minute = currentGarbageTime - hour * 60

      ;(info.querySelector('.constDrop') as HTMLElement).classList.remove(
        'hidden'
      )
      if (currentGarbageTime == 0) {
        ;(info.querySelector('.constDrop') as HTMLElement).classList.add(
          'hidden'
        )
      }

      let statistic = info.querySelector('.static-number') as HTMLSpanElement

      title_bandage.classList.remove('red')
      title_bandage.classList.remove('green')
      title_bandage.classList.remove('orange')
      statistic.classList.remove('red-text')
      statistic.classList.remove('green-text')
      statistic.classList.remove('orange-text')
      let states = v.StationState as Flags<StationState>
      title_bandage.textContent = '' //states.value.toString()
      if (states.contains(StationState.Error)) {
        title_bandage.textContent += Language.StationState(StationState.Error)
        title_bandage.classList.add('red')
        statistic.textContent = Language.StationState(StationState.Error)
        statistic.classList.add('red-text')
      } else if (states.contains(StationState.Full)) {
        title_bandage.textContent += Language.StationState(StationState.Full)
        title_bandage.classList.add('orange')
        statistic.textContent = Language.StationState(StationState.Full)
        statistic.classList.add('orange-text')
      } else {
        title_bandage.textContent += Language.StationState(StationState.Normal)
        title_bandage.classList.add('green')
        statistic.textContent = Language.StationState(StationState.Normal)
        statistic.classList.add('green-text')
      }

      this.createFooter(v.Id, v.DivisionId)

      let wrapper = info.querySelector(
        '.content__img .swiper-wrapper'
      ) as HTMLDivElement
      let slide = wrapper.querySelector('.swiper-slide') as HTMLDivElement
      let imageUrls: Array<IImageUrl> = []

      this.dataController
        .getCameraList(v.Id, (cameraId: string, url?: string) => {})
        .then((cameras) => {
          //// console.log(v.Id)
          //// console.log(cameras)
          if (cameras.length == 0) {
            //console.log(v.Id + ":" + v.Name);
            let div = slide as HTMLDivElement
            div.innerHTML = '暂未布置摄像机'
            div.className = 'no-camera'
            wrapper.appendChild(div)
            return
          }
          cameras.forEach((camera, index) => {
            imageUrls.push({
              cameraName: camera.Name,
              url: camera.getImageUrl()!,
              cameraId: camera.Id,
              preview: camera.getPreviewUrl(),
            })
            let div: HTMLDivElement

            index != 0
              ? (div = slide?.cloneNode(true) as HTMLDivElement)
              : (div = slide)

            let img = div!.querySelector('img') as HTMLImageElement
            img.id = camera.Id
            img.setAttribute('index', index + '')
            img.src = camera.getImageUrl()!
            img.onerror = function () {
              img.src = CameraViewModel.defaultImageUrl
            }
            img.onload = (el) => {
              img.removeAttribute('data-src')
            }
            // img!.src = camera.ImageUrl!;

            if (
              !camera.OnlineStatus == undefined ||
              camera.OnlineStatus == OnlineStatus.Offline
            ) {
              let nosignal = div.querySelector('.nosignal') as HTMLDivElement
              nosignal.style.display = 'block'
            }

            wrapper!.appendChild(div)
          })
        })
      content_card.addEventListener('click', function (e) {
        let target = e.target as HTMLElement
        let currentTarget = e.currentTarget as HTMLDivElement
        if (!!_this.getTarget(target, 'tagName', 'img')) {
          let ev = new CustomEvent('cat', {
            detail: {
              index: target.getAttribute('index'),
              id: currentTarget.id!,
            },
          })
          _this.customElement.dispatchEvent(ev)
        } else if (!!_this.getTarget(target, 'classList', 'user-label')) {
          let current = _this.getTarget(target, 'classList', 'user-label')
          if (!current) {
            return
          }
          // user-label-310110016005035000
          let id = current.id.substring('user-label-'.length)
          let data = _this.garbageStationsTotal.find(
            (x) => x.Id === id
          ) as GarbageStationViewModel
          let promise = data.getUserLabel()

          promise
            .then((x) => {
              let p = new UserLabelAside(
                _this.elements.container.userLabelContainer,
                data,
                _this.dataController
              )

              p.init()
              p.add(_this)
              _this.showUserLabel = true
            })
            .catch((x) => {
              let p = new CreateUserLabelAside(
                _this.elements.container.userLabelContainer,
                data,
                _this.dataController
              )

              p.init()
              p.add(_this)

              _this.showUserLabel = true
            })
        } else {
        }
      })

      this.garbageElements.set(v.Id, {
        Element: content_card,
        id: v.Id,
        divisionId: v.DivisionId,
        imageUrls: imageUrls,
        state: v.StationState,
        currentGarbageTime: currentGarbageTime,
      })
      this.elements.container.hwContainer?.appendChild(info)
    }
  }

  private getTarget(
    target: HTMLElement,
    property: 'tagName' | 'classList',
    name: string
  ): HTMLElement | undefined {
    let has = false
    switch (property) {
      case 'tagName':
        has = target.tagName.toString().toLowerCase() === name
        break
      case 'classList':
        has = target.classList.contains(name)
        break
      default:
        break
    }

    if (has) {
      return target
    }
    if (target.parentElement) {
      return this.getTarget(target.parentElement, property, name)
    } else {
      return undefined
    }
  }

  private async loadCameraImage(id: string) {
    let res = await this.dataController.getCameraList(
      id,
      (cameraId: string, url?: string) => {}
    )
    return res
  }
  // 创建居委会banner
  createFooter(id: string, divisionId: string) {
    let p = this.dataController.getDivision(divisionId)
    p.then((division) => {
      let info = document.getElementById(id) as HTMLDivElement

      let content_footer = info.querySelector(
        '.content__footer .division-name'
      ) as HTMLDivElement
      content_footer.innerHTML = division.Name
    })
  }
  toggle() {
    this.showAside = !this.showAside
  }
  createAside(eventType?: string) {
    let type = this.type + 1 > 3 ? 3 : this.type + 1

    this.myAside = null
    this.myAside = new MyAside(this.elements.container.asideContainer, [
      {
        title: '状态',
        data: [
          {
            Name: Language.StationState(StationState.Normal),
            Id: StationState.Normal.toString(),
            isSelected: false,
          },
          {
            Name: Language.StationState(StationState.Error),
            Id: StationState.Error.toString(),
            isSelected: false,
          },
        ],
        type: 'state',
        shrink: false,
        mode: SelectionMode.multiple,
      },
      {
        title: Language.ResourceType(type),
        data: this.roleList,
        type: 'role',
        mode: SelectionMode.multiple,
      },
    ]).init()

    this.myAside.add(this)
  }
  createChartAside() {
    // let params = this.garbageStationsTotal.map((item) => {
    //   return {
    //     id: item.Id,
    //     name: item.Name,
    //   }
    // })
    //let names = this.garbageStationsTotal.map((item) => item.Name)

    //console.log('create chart aside');
    this.myChartAside = new EchartsAside(
      this.elements.container.chartContainer,
      this.dataController,
      this.garbageStationsTotal,
      new Date()
    )

    this.myChartAside.init()
    this.myChartAside.add(this)
  }

  filerContent() {
    let str = this.elements.btns.searchInput.value
    for (let [k, v] of this.garbageElements) {
      let div = v.Element
      //// console.log(div)
      if (str && !div.textContent!.includes(str)) {
        div.style.display = 'none'
      } else {
        div.style.display = ''
      }
    }
  }
  // 放大
  zoomIn() {
    let _this = this
    //// console.log(this.garbageElements);
    for (let [k, v] of this.garbageElements) {
      let contentCard = v.Element
      ;(
        Array.from(
          contentCard.querySelectorAll('.content__img')
        ) as HTMLElement[]
      ).forEach((element: HTMLElement) => {
        element.classList.add(ZoomStatus.in)
      })
      ;(
        Array.from(
          contentCard.querySelectorAll('.swiper-slide')
        ) as HTMLElement[]
      ).forEach((element: HTMLElement) => {
        element.classList.add(ZoomStatus.in)
      })
      ;(
        Array.from(
          contentCard.querySelectorAll('.content__title__badage')
        ) as HTMLElement[]
      ).forEach((element: HTMLElement) => {
        element.classList.add(ZoomStatus.in)
      })
      ;(
        Array.from(
          contentCard.querySelectorAll('.content__footer')
        ) as HTMLElement[]
      ).forEach((element: HTMLElement) => {
        element.classList.add(ZoomStatus.in)
      })

      let container = contentCard.querySelector(
        '.swiper-container'
      ) as HTMLDivElement
      container.scrollLeft = 0
      container.classList.add(ZoomStatus.in)

      let pagination = contentCard.querySelector(
        '.swiper-pagination'
      ) as HTMLDivElement

      if (v.swiper) {
        v.swiper.destroy()
        v.swiper = null
      }
      v.swiper = new Swiper(container, {
        pagination: {
          el: pagination,
          type: 'fraction',
        },
      })
    }

    this.zoomStatus = ZoomStatus.in
  }
  // 缩小
  zoomOut() {
    for (let [k, v] of this.garbageElements) {
      let contentCard = v.Element
      contentCard
        .querySelectorAll('.swiper-slide')
        .forEach((element: HTMLElement) => {
          element.classList.remove(ZoomStatus.in)
          element.style.width = ''
        })
      contentCard
        .querySelectorAll('.content__title__badage')
        .forEach((element: HTMLElement) => {
          element.classList.remove(ZoomStatus.in)
        })
      contentCard
        .querySelectorAll('.content__footer')
        .forEach((element: HTMLElement) => {
          element.classList.remove(ZoomStatus.in)
        })

      contentCard
        .querySelectorAll('.content__img')
        .forEach((element: HTMLElement) => {
          element.classList.remove(ZoomStatus.in)
        })

      let container = contentCard.querySelector('.swiper-container')
      container.classList.remove(ZoomStatus.in)

      if (v.swiper) {
        v.swiper.destroy()
        v.swiper = null
      }
    }

    this.zoomStatus = ZoomStatus.out
  }
  showDetail(info: { id: string; index: number }, a: number) {
    let _this = this
    let element = this.garbageElements.get(info.id)
    let imgs = element.imageUrls
    this.activeElement = element

    if (this.swiper) {
      this.swiper.destroy()
      this.swiper = null
    }
    $(this.elements.others.originImg).fadeIn()
    this.originStatus = true
    if (!this.swiper) {
      let inited = false
      this.swiper = new Swiper(this.elements.others.originImg, {
        virtual: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
        },
        on: {
          init: (swiper: Swiper) => {
            if (this.video) {
              this.video.destory()
              this.video = undefined
            }

            setTimeout(() => {
              inited = true
              let btn = swiper.el.querySelector(
                '.swiper-slide-active .video-control'
              ) as HTMLDivElement
              btn.addEventListener('click', (e) => {
                this.onPlayControlClicked(
                  element.imageUrls[swiper.activeIndex],
                  btn
                )
                e.stopPropagation()
              })
            }, 100)
          },
          click: (swiper: Swiper, e) => {},
          slideChange: (swiper: Swiper) => {
            if (inited == false) return

            if (this.video) {
              this.video.destory()
              this.video = undefined
            }

            setTimeout(() => {
              let btn = swiper.el.querySelector(
                '.swiper-slide-active .video-control'
              ) as HTMLDivElement
              btn.addEventListener('click', (e) => {
                this.onPlayControlClicked(
                  element.imageUrls[swiper.activeIndex],
                  btn
                )
                e.stopPropagation()
              })
            }, 100)

            // btn.addEventListener("click", (e)=>{
            //   debugger;
            //   e.stopPropagation();
            // })
          },
        },
      })
    }
    this.swiper.virtual.removeAllSlides()
    this.swiper.virtual.cache = []
    for (let i = 0; i < imgs.length; i++) {
      let container = this.createSwiperContainer(imgs[i])

      this.swiper.virtual.appendSlide(container.outerHTML)

      // this.swiper.virtual.appendSlide('<div class="swiper-zoom-container">' +
      //   '<div><a onclick="return false"><i class="howell-icon-real-play"></i></a></div>'
      //   + '<img src="' + url +
      //   '" /></div>');
    }
    this.swiper.slideTo(info.index, 0)
  }

  video?: VideoPlugin
  tools?: PlayerTools

  onPlayControlClicked(index: IImageUrl, div: HTMLDivElement) {
    if (this.video) {
      this.video.destory()
      this.video = undefined
    }
    let img = div.data as IImageUrl
    if (!img) {
      img = index
    }
    if (img.preview) {
      img.preview.then((x) => {
        this.video = new VideoPlugin(
          img.cameraName!,
          x.Url,
          x.WebUrl,
          this.dataController.picture
        )
        this.video.onFullscreenChanged = (is) => {
          let pagination = document.querySelector(
            '.swiper-pagination.swiper-pagination-fraction'
          ) as HTMLDivElement
          if (!pagination) return

          if (is) {
            pagination.style.display = 'none'
          } else {
            pagination.style.display = ''
          }
        }
        if (this.video.iframe) {
          this.video.autoSize()
        }
        if (div.parentElement) {
          this.video.loadElement(div.parentElement, 'live')
        }
      })
    }
  }

  createSwiperContainer(imageUrl: IImageUrl) {
    let container = document.createElement('div')
    container.className = 'swiper-zoom-container'

    let img = document.createElement('img')
    img.src = imageUrl.url //this.dataController.getImageUrl(imageUrl.url)!;
    container.appendChild(img)

    let control = document.createElement('div')
    control.className = 'video-control'
    control.data = imageUrl
    // let icon = document.createElement("i");
    // icon.className = "howell-icon-real-play"
    // control.appendChild(icon);

    container.appendChild(control)

    return container
  }
}
