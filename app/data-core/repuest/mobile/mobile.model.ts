export class MobileViewModel {
  MobileNo?: string;
  CheckCode?: string;

  title: string = '';
  okButtonText: string = '';
}
export enum MobileChangeStep {
  Check = 0,
  Bind = 1,
}
