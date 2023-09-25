import { Injectable } from '@angular/core';
import { MessageBar } from 'src/app/common/tools/message-bar';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { MobileBindingService } from '../mobile-binding.service';
import { MobileViewModel } from '../mobile.model';

@Injectable()
export class MobileChangeCheckBusiness {
  constructor(
    private service: MobileBindingService,
    private local: LocalStorageService
  ) {
    this.model = this.createModel();
  }

  model: MobileViewModel;

  checkCodeResult?: string;

  createModel() {
    let model = new MobileViewModel();
    model.title = '验证手机号码';
    model.okButtonText = '验证';
    model.MobileNo = this.local.user.MobileNo;
    return model;
  }

  async getCheckCode(mobileNo: string) {
    if (this.model.MobileNo) {
      let result = await this.service.sendCheckCode(this.model.MobileNo);
      this.checkCodeResult = result.Code;
    }
  }

  async checkMobileNo() {
    if (!this.checkCodeResult) {
      MessageBar.response_warning('请先验证手机号。');
      return;
    }
    if (this.checkCodeResult !== this.model.CheckCode) {
      MessageBar.response_warning('请正确填写验证码。');
      return;
    }

    if (this.model.MobileNo) {
      return this.service.check(this.model.MobileNo);
    }
    return false;
  }
}
