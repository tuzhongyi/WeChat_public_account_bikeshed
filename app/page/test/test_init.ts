import { HowellAuthHttp } from '../../data-core/repuest/howell-auth-http'
import { HowellHttpClient } from '../../data-core/repuest/http-client'
let wx = Reflect.get(window, 'wx')
export namespace TestPage {
  class Test {
    asmx = '/PlatformManage/WeiXinApi_Mp/WeiXinMpApi.asmx'
    command = 'GetJsSdkUiPackage'
    query = {
      url: window.location.href,
    }

    constructor(private page: Page, private http: HowellAuthHttp) {
      this.init()
      this.regist()
    }

    get wxapi() {
      return `${this.asmx}/${this.command}?returnUrl=${this.query.url}`
    }

    inited = false

    async init() {
      console.log('src:', this.wxapi)
      let api = await this.http.get(this.wxapi)
      console.log('api:', api)
      wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: api.appId, // 必填，公众号的唯一标识
        timestamp: api.timestamp.toString(), // 必填，生成签名的时间戳
        nonceStr: api.nonceStr.toString(), // 必填，生成签名的随机串
        signature: api.signature.toString(), // 必填，签名
        jsApiList: ['getLocation', 'chooseImage', 'getLocalImgData'], // 必填，需要使用的JS接口列表
      })
    }

    regist() {
      this.page.element.location.get.addEventListener('click', () => {
        this.getLocation()
      })
    }

    getLocation() {
      wx.getLocation({
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: (res: any) => {
          console.log(res)

          var latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
          var longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
          var speed = res.speed // 速度，以米/每秒计
          var accuracy = res.accuracy // 位置精度
          console.log(this, this.page, this.page.element)
          this.page.element.location.lon.innerHTML = longitude
          this.page.element.location.lat.innerHTML = latitude
        },
      })
    }

    test() {
      this.page.element.openid.innerHTML = location.href
    }
  }

  class Page {
    element = {
      openid: document.querySelector('.openid') as HTMLDivElement,
      location: {
        lon: document.getElementById('lon') as HTMLSpanElement,
        lat: document.getElementById('lat') as HTMLSpanElement,
        get: document.getElementById('getlocation') as HTMLDivElement,
      },
    }
  }

  let page = new Page()
  var httpClient = new HowellHttpClient.HttpClient()
  let test = new Test(page, httpClient.http)
  test.test()
}
