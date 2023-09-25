import { GarbageBaseUrl } from '../IUrl'
export class AIModel {
  create(): string {
    return GarbageBaseUrl.garbage_gateway + 'AIModels'
  }
  edit(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `AIModels/${id}`
  }
  del(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `AIModels/${id}`
  }
  get(id: string): string {
    return GarbageBaseUrl.garbage_gateway + `AIModels/${id}`
  }
  list(): string {
    return GarbageBaseUrl.garbage_gateway + `AIModels/List`
  }

  parse() {
    return GarbageBaseUrl.garbage_gateway + `AIModels/Parse`
  }
}
