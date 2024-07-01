import { TubeGeometry } from "three"
import { CatmullRomCurve3 } from "three"
import * as Three from "three";

// 创建一个 CatmullRomCurve3 实例
const path = new CatmullRomCurve3([
  new Three.Vector3(0, 0, 0),
  new Three.Vector3(10, 0, 0),
  new Three.Vector3(10, 10, 0),
  new Three.Vector3(0, 10, 0)
])

// 创建一个 TubeGeometry 实例
const myTube = new TubeGeometry(path, 64, 2, 8, false)

// 导出 TubeGeometry 实例
export default myTube
