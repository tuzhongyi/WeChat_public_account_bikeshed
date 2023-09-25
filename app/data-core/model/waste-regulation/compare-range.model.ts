/**
 * 查询比较范围
 */
export class CompareRange<T> {
  /**	T	大于数值	O */
  GreaterThan?: T;
  /**	T	小于数值	O */
  LessThan?: T;
  /**
   * 	Boolean	是否同时等于，如果时True，则GreaterThan，LessThan同时包括对应数值，否则保持大于小于的比较。默认是：False	O
   */
  IsEqual?: boolean;
}
