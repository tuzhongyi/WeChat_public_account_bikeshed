import { Transform } from 'class-transformer'
import { transformDateTime } from './transformer'

export class PictureUrl {
  /**	String	图片ID	O	*/ Id?: string
  /**	String	图片URL地址	O	*/ Url?: string
  /**	DateTime	创建时间	O	*/ @Transform(transformDateTime) CreateTime?: Date
}
