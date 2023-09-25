import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { User } from 'src/app/network/model/user.model';
import { MobileBindingService } from '../mobile-binding.service';
import { MobileChangeStep, MobileViewModel } from '../mobile.model';
import { MobileChangeBindBusiness } from './mobile-change-bind.business';
import { MobileChangeCheckBusiness } from './mobile-change-check.business';

@Component({
  selector: 'app-mobile-change',
  templateUrl: './mobile-change.component.html',
  styleUrls: ['./mobile-change.component.css'],
  providers: [
    MobileBindingService,
    MobileChangeCheckBusiness,
    MobileChangeBindBusiness,
  ],
})
export class MobileChangeComponent implements OnInit {
  user: User;
  MobileChangeStep = MobileChangeStep;

  @Input('Step')
  step = MobileChangeStep.Check;

  @Output()
  OnBinded: EventEmitter<void> = new EventEmitter();
  @Output()
  OnCancel: EventEmitter<void> = new EventEmitter();

  constructor(
    public checkBusiness: MobileChangeCheckBusiness,
    public bindBusiness: MobileChangeBindBusiness,
    private local: LocalStorageService
  ) {
    this.user = this.local.user;
  }

  ngOnInit() {}

  cancel() {
    this.OnCancel.emit();
  }

  async check(model: MobileViewModel) {
    let result = await this.checkBusiness.checkMobileNo();
    if (result) {
      this.step = MobileChangeStep.Bind;
    }
  }

  async bind(model: MobileViewModel) {
    let result = await this.bindBusiness.bind();
    if (result) {
    }
    this.OnBinded.emit();
  }
}
