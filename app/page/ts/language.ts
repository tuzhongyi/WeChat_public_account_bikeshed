import { EventType } from '../../data-core/model/waste-regulation/event-number'
import { TaskType } from '../../data-core/model/waste-regulation/event-task'
import { FeedbackResult } from '../../data-core/model/waste-regulation/garbage-drop-feedback.model'
import { StationState } from '../../data-core/model/waste-regulation/garbage-station'
import { GenderType, ResourceType } from '../../data-core/model/we-chat'

export class Language {
  static ResourceType(type: ResourceType) {
    switch (type) {
      case ResourceType.County:
        return '街道'
      case ResourceType.Committees:
        return '居委会'
      case ResourceType.GarbageStations:
        return '厢房'
      default:
        return ''
    }
  }
  static EventType(type: EventType) {
    switch (type) {
      case EventType.IllegalDrop:
        return '垃圾落地事件'
      case EventType.MixedInto:
        return '混合投放事件'
      case EventType.GarbageVolume:
        return '垃圾容量事件'
      case EventType.GarbageFull:
        return '垃圾满溢事件'
      case EventType.GarbageDrop:
        return '小包垃圾滞留'
      case EventType.GarbageDropHandle:
        return '小包垃圾处置'
      case EventType.GarbageDropTimeout:
        return '小包垃圾处置超时'
      default:
        return ''
    }
  }
  static EventTypeFilter(type: EventType) {
    switch (type) {
      case EventType.IllegalDrop:
        return '垃圾落地事件'
      case EventType.MixedInto:
        return '混合投放事件'
      case EventType.GarbageVolume:
        return '垃圾容量事件'
      case EventType.GarbageFull:
        return '垃圾满溢事件'
      case EventType.GarbageDrop:
        return '垃圾滞留'
      case EventType.GarbageDropHandle:
        return '垃圾处置'
      case EventType.GarbageDropTimeout:
        return '垃圾滞留'
      default:
        return ''
    }
  }
  static GarbageDropEventType(type: EventType) {
    switch (type) {
      case EventType.GarbageDrop:
        return '垃圾待处置'
      case EventType.GarbageDropHandle:
        return '垃圾已处置'
      case EventType.GarbageDropTimeout:
        return '垃圾处置超时'
      default:
        return ''
    }
  }

  static Gender(gender: GenderType) {
    switch (gender) {
      case GenderType.unknow:
        return ''
      case GenderType.male:
        return '男'
      case GenderType.female:
        return '女'
      default:
        return '  '
    }
  }

  static StationState(state: StationState) {
    switch (state) {
      case StationState.Normal:
        return '正常'
      case StationState.Full:
        return '满溢'
      case StationState.Error:
        return '异常'
      default:
        return ''
    }
  }

  static TaskType(type: TaskType) {
    switch (type) {
      case TaskType.full:
        return '垃圾满溢'
      case TaskType.retention:
        return '垃圾滞留'
      default:
        return ''
    }
  }

  static Level(level: number) {
    switch (level) {
      case 1:
        return '一级'
      case 2:
        return '二级'
      case 3:
        return '三级'
      default:
        return ''
    }
  }
  static FeedbackResult(state?: FeedbackResult) {
    switch (state) {
      case FeedbackResult.complete:
        return '完成'
      case FeedbackResult.falsealarm:
        return '误报'
      case FeedbackResult.nostandard:
        return '管理不规范'
      default:
        return ''
    }
  }
  static Time(time?: number) {
    if (time === undefined) return undefined
    let hour = Math.floor(time / 60)
    let minute = time - hour * 60
    let res =
      hour == 0
        ? Math.ceil(minute) + '分钟'
        : hour + '小时' + Math.ceil(minute) + '分钟'
    return res
  }
}

export class ClassNameHelper {
  static StationState(state: StationState) {
    switch (state) {
      case StationState.Normal:
        return 'green'
      case StationState.Full:
        return 'orange'
      case StationState.Error:
        return 'red'
      default:
        return 'unknow'
    }
  }
}
