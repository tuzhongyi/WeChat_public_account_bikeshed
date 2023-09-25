export class Tool {
  public static getDistance = function (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) {
    var EARTH_RADIUS = 6378.137 //地球半径,单位千米
    function rad(d: number) {
      return (d * Math.PI) / 180.0
    }

    var radLat1 = rad(lat1)
    var radLat2 = rad(lat2)
    var a = radLat1 - radLat2
    var b = rad(lng1) - rad(lng2)

    var s =
      2 *
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
        )
      )
    s = s * EARTH_RADIUS
    s = Math.round(s * 10000) / 10000
    return s
  }
}
