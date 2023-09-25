import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageBar } from 'src/app/common/tools/message-bar';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { User } from 'src/app/network/model/user.model';

import { MobileBindingService } from '../mobile-binding.service';

@Component({
  selector: 'app-mobile-binding',
  templateUrl: './mobile-binding.component.html',
  styleUrls: ['./mobile-binding.component.css'],
  providers: [MobileBindingService],
})
export class MobileBindingComponent implements OnInit {
  constructor(
    private service: MobileBindingService,
    private local: LocalStorageService
  ) {
    this.user = local.user;
  }

  user: User;

  form: FormGroup = new FormGroup({
    mobileNo: new FormControl(''),
    checkCode: new FormControl(''),
  });
  get mobileNo(): string {
    return this.form.value.mobileNo;
  }

  get checkCode(): string {
    return this.form.value.checkCode;
  }

  private checkCodeResult?: string;

  ngOnInit() {}

  async checkMobilNo() {
    if (!this.mobileNo) {
      MessageBar.response_warning('请输入手机号。');
      return false;
    }
    if (this.mobileNo.length !== 11) {
      MessageBar.response_warning('请正确输入您的手机号。');
      return false;
    }
    let result = await this.service.check(this.mobileNo);
    if (result) {
      MessageBar.response_warning('该号码已被注册。');
      return false;
    }
    return true;
  }

  async getCheckCode(event: Event) {
    let checkMobilNo = await this.checkMobilNo();
    if (!checkMobilNo) return;

    if (this.getCheckCodeDisabled) return;

    let result = await this.service.sendCheckCode(this.mobileNo);
    this.checkCodeResult = result.Code;
    this.seconds = 30;
    this.getCheckCodeDisabled = 'disabled';
    this.countdown();
  }

  seconds = 0;
  countdown() {
    setTimeout(() => {
      this.seconds--;
      this.getCheckCodeDisabled = this.seconds > 0 ? 'disabled' : '';
      if (this.seconds > 0) {
        this.countdown();
      }
    }, 1000);
  }

  checkCheckCode() {
    if (this.checkCodeResult !== this.checkCode) {
      MessageBar.response_warning('验证码不一致。');
      return false;
    }
    return true;
  }

  getCheckCodeDisabled = '';

  @Output()
  OnBinded: EventEmitter<void> = new EventEmitter();
  @Output()
  OnCancel: EventEmitter<void> = new EventEmitter();

  async binding(event: Event) {
    if (!this.checkCode) {
      MessageBar.response_warning('请填写验证码。');
      return;
    }
    if (this.checkCode !== this.checkCodeResult) {
      MessageBar.response_warning('请填写正确的验证码。');
      return;
    }

    this.user.MobileNo = this.mobileNo;
    let result = await this.service.setUser(this.user);
    if (result) {
      this.local.user = this.user;
      this.OnBinded.emit();
    }

    event.stopPropagation();
  }
  cancel(event: Event) {
    this.OnCancel.emit();
    event.stopPropagation();
  }
}
