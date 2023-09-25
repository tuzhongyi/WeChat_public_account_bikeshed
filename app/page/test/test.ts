export namespace TestPage {
  class Test {
    asmx = '/PlatformManage/WeiXinApi_Mp/WeiXinMpApi.asmx'
    command = 'GetJsSdkUiPackage'
    query = {
      url: window.location.href,
      appId: 'wxbdb83aa395f57581',
      inited: false,
    }

    constructor(private page: Page) {}

    get wxapi() {
      return `${this.asmx}/${this.command}?${this.query.url}&${this.query.appId}`
    }

    inited = false

    init() {
      // wx.config({
      //   debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      //   appId: this.query.appId, // 必填，公众号的唯一标识
      //   timestamp: new Date(), // 必填，生成签名的时间戳
      //   nonceStr: '', // 必填，生成签名的随机串
      //   signature: '', // 必填，签名
      //   jsApiList: [], // 必填，需要使用的JS接口列表
      // })
    }

    test() {
      this.page.element.openid.innerHTML = location.href
    }
  }

  class Page {
    element = {
      openid: document.querySelector('.openid') as HTMLDivElement,
    }
  }

  let page = new Page()
  let test = new Test(page)
  test.test()
}
