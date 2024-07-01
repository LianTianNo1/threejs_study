import { LatheGeometry } from "three"
import * as Three from "three";

// 创建一个二维点数组，代表旋转路径
const points = []
points.push(new Three.Vector2(0, 0))
points.push(new Three.Vector2(5, 0))
points.push(new Three.Vector2(5, 5))
points.push(new Three.Vector2(0, 5))

// 创建一个 LatheGeometry 实例
const myLathe = new LatheGeometry(points, 12)

// 导出 LatheGeometry 实例
export default myLathe
