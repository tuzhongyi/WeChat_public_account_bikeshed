import { wait } from '../../page/ts/tools/wait.tool'
import { HowellAuthHttp } from './howell-auth-http'
let wx = Reflect.get(window, 'wx')
export class WeChatAPIRequestService {
  asmx = '/PlatformManage/WeiXinApi_Mp/WeiXinMpApi.asmx'

  command = 'GetJsSdkUiPackage'
  query = {
    url: window.location.href,

    // `${window.location.origin}${window.location.pathname.toLowerCase()}${
    //   window.location.search
    // }`,
  }
  constructor(private http: HowellAuthHttp) {
    this.init()
  }
  get wxapi() {
    return `${this.asmx}/${this.command}?returnUrl=${this.query.url}`
  }

  inited = false

  async init() {
    try {
      console.log('src:', this.wxapi)
      let api = await this.http.get(this.wxapi)
      console.log('api:', api)
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: api.appId, // 必填，公众号的唯一标识
        timestamp: api.timestamp.toString(), // 必填，生成签名的时间戳
        nonceStr: api.nonceStr.toString(), // 必填，生成签名的随机串
        signature: api.signature.toString(), // 必填，签名
        jsApiList: ['getLocation', 'chooseImage', 'getLocalImgData'], // 必填，需要使用的JS接口列表
      })

      wx.ready(() => {
        this.inited = true
      })
      wx.error((res: any) => {
        this.inited = true
        alert('error:' + JSON.stringify(res))
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      })
    } catch (error) {
      alert('wechat api init faild')
    }
  }

  getLocation() {
    return new Promise<number[]>((resolve, reject) => {
      wait(() => {
        return this.inited
      })
        .then((x) => {
          wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: (res: any) => {
              var latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
              var longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
              var speed = res.speed // 速度，以米/每秒计
              var accuracy = res.accuracy // 位置精度

              resolve([longitude, latitude])
            },
          })
        })
        .catch((x) => {
          reject('timeout')
        })
    })
  }
  chooseImage() {
    return new Promise<string[]>((resolve, reject) => {
      wait(() => {
        return this.inited
      })
        .then((x) => {
          wx.chooseImage({
            count: 3, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res: any) {
              var localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
              resolve(localIds)
            },
          })
        })
        .catch((x) => {
          reject('timeout')
        })
    })
  }
  getLocalImgData(localId: string) {
    return new Promise<{ id: string; data: string }>((resolve, reject) => {
      wait(() => {
        return this.inited
      })
        .then((x) => {
          wx.getLocalImgData({
            localId: localId,
            success: function (res: any) {
              var localData = res.localData // localData是图片的base64数据，可以用img标签显示

              resolve({ id: localId, data: localData })
            },
          })
        })
        .catch((x) => {
          reject('timeout')
        })
    })
  }
}
