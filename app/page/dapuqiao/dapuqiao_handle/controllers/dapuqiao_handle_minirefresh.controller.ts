export class DaPuQiaoHandleMiniRefreshController {
  constructor(args: {
    id: string
    down: () => Promise<void>
    up: () => Promise<boolean>
  }) {
    this.miniRefresh = this.create(args.id)
    this.event.down = args.down
    this.event.up = args.up
  }
  miniRefresh: MiniRefresh

  event: {
    down?: () => Promise<void>
    up?: () => Promise<boolean>
  } = {}

  private create(id: string) {
    return new MiniRefresh({
      container: '#' + id,
      down: {
        isAuto: true,
        bounceTime: 0,
        callback: () => {
          if (this.miniRefresh) {
            this.down(this.miniRefresh)
          }
        },
      },
      up: {
        isAuto: false,
        callback: () => {
          if (this.miniRefresh) {
            this.up(this.miniRefresh)
          }
        },
      },
    })
  }

  trigger() {
    this.miniRefresh.triggerDownLoading()
  }

  private down(r: MiniRefresh) {
    if (this.event.down) {
      this.event.down().finally(() => {
        r.endDownLoading()
      })
    } else {
      r.endDownLoading()
    }
  }
  private up(r: MiniRefresh) {
    {
      if (this.event.up) {
        this.event
          .up()
          .then((stop) => {
            r.endUpLoading(stop)
          })
          .catch((x) => {
            r.endUpLoading(false)
          })
      } else {
        r.endUpLoading(false)
      }
    }
  }
}
