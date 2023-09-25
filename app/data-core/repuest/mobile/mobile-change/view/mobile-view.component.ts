import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageBar } from 'src/app/common/tools/message-bar';
import { MobileBindingService } from '../../mobile-binding.service';
import { MobileViewModel } from '../../mobile.model';

@Component({
  selector: 'app-mobile-view',
  templateUrl: './mobile-view.component.html',
  styleUrls: ['./mobile-view.component.css'],
  providers: [MobileBindingService],
})
export class MobileViewComponent implements OnInit, OnChanges {
  form: FormGroup = new FormGroup({
    mobileNo: new FormControl(''),
    checkCode: new FormControl(''),
  });

  get mobileNo(): string {
    return this.form.controls.mobileNo.value;
  }
  get checkCode(): string {
    return this.form.controls.checkCode.value;
  }

  @Input('Model')
  model: MobileViewModel = new MobileViewModel();

  @Output()
  OnGetCheckCodeClick: EventEmitter<string> = new EventEmitter();

  @Output()
  OnOKClick: EventEmitter<MobileViewModel> = new EventEmitter();

  @Output()
  OnCancelClick: EventEmitter<void> = new EventEmitter();

  seconds = 0;
  getCheckCodeDisabled = '';

  constructor(private service: MobileBindingService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.model) {
      if (this.model.MobileNo) {
        this.form.patchValue({ mobileNo: this.model.MobileNo });
        this.form.controls.mobileNo.disable();
      }
    }
  }

  ngOnInit() {}

  countdown() {
    setTimeout(() => {
      this.seconds--;
      this.getCheckCodeDisabled = this.seconds > 0 ? 'disabled' : '';
      if (this.seconds > 0) {
        this.countdown();
      }
    }, 1000);
  }

  async checkMobilNo() {
    if (!this.model) return;
    if (!this.model.MobileNo && !this.mobileNo) {
      MessageBar.response_warning('请输入手机号。');
      return false;
    }
    if (this.mobileNo.length !== 11) {
      MessageBar.response_warning('请正确输入您的手机号。');
      return false;
    }
    let result = await this.service.check(this.mobileNo);
    if (this.model.MobileNo && result) {
      return true;
    } else if (result) {
      this.seconds = 0;
      MessageBar.response_warning('该号码已被注册。');
      return false;
    } else {
      return true;
    }
  }

  ok(event: Event) {
    if (!this.model) return;
    if (!this.checkCode) {
      MessageBar.response_warning('请填写验证码。');
      return;
    }
    console.log(this.form.controls.mobileNo);
    this.model.CheckCode = this.checkCode;
    this.model.MobileNo = this.mobileNo;
    this.OnOKClick.emit(this.model);
  }
  cancel(event: Event) {
    this.OnCancelClick.emit();
  }
  getCheckCode(event: Event) {
    let checked = this.checkMobilNo();
    if (!checked) {
      return;
    }
    if (this.seconds > 0) return;
    this.seconds = 60;
    this.getCheckCodeDisabled = 'disabled';
    this.countdown();
    this.OnGetCheckCodeClick.emit(this.mobileNo);
  }
}
