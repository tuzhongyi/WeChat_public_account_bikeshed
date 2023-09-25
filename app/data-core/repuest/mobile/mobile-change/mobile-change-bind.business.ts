import { EventEmitter, Injectable } from '@angular/core';
import { MessageBar } from 'src/app/common/tools/message-bar';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { User } from 'src/app/network/model/user.model';
import { MobileBindingService } from '../mobile-binding.service';
import { MobileViewModel } from '../mobile.model';

@Injectable()
export class MobileChangeBindBusiness {
  user: User;
  constructor(
    private service: MobileBindingService,
    private local: LocalStorageService
  ) {
    this.model = this.createModel();
    this.user = this.local.user;
  }

  model: MobileViewModel;

  checkCodeResult?: string;

  stopDownCount: EventEmitter<void> = new EventEmitter();

  createModel() {
    let model = new MobileViewModel();
    model.title = '绑定新手机';
    model.okButtonText = '绑定';
    return model;
  }

  async getCheckCode(mobileNo: string) {
    let result = await this.service.sendCheckCode(mobileNo);
    this.checkCodeResult = result.Code;
  }

  async bind() {
    if (!this.checkCodeResult) {
      MessageBar.response_warning('请先验证手机号。');
      return;
    }
    if (this.checkCodeResult !== this.model.CheckCode) {
      MessageBar.response_warning('请正确填写验证码。');
      return;
    }

    this.user.MobileNo = this.model.MobileNo;

    return this.service.setUser(this.user).then((x) => {
      this.local.user = this.user;
      return x;
    });
  }
}
