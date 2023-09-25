import { WeChatUser } from '../data-core/model/we-chat'

export class SessionUser {
  constructor() {
    // this.division='310109011000';
    // this.user= {
    //     name:'guangzhong',
    //     pwd:'123456'
    // }
  }

  set WUser(val: WeChatUser) {
    localStorage.setItem('WUser', JSON.stringify(val))
  }

  get WUser() {
    const val = localStorage.getItem('WUser')

    return JSON.parse(val!)
  }
  set user(val: { name: string; pwd: string | undefined }) {
    this.pwd = val.pwd
    this.name = val.name
  }

  get user() {
    return {
      name: this.name ?? '',
      pwd: this.pwd,
    }
  }

  set division(val: string | undefined) {
    let str = JSON.stringify(val)
    localStorage.setItem('division', str)
  }

  get division() {
    let val = localStorage.getItem('division')
    if (val) {
      return JSON.parse(val)
    }
    return undefined
  }

  set name(val: string | undefined) {
    localStorage.setItem('name', val ?? '')
  }

  get name() {
    let val = localStorage.getItem('name')
    if (val) {
      return val
    }
    return undefined
  }

  set pwd(val: string | undefined) {
    localStorage.setItem('pwd', val ?? '')
  }

  get pwd() {
    return localStorage.getItem('pwd') ?? undefined
  }
}
