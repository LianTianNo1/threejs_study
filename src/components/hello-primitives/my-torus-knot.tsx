import { TorusKnotGeometry } from "three"

// 设定圆环半径
const radius = 5

// 设定圆环管子的半径
const tubeRadius = 2

// 设定圆环的环绕次数
const radialSegments = 8

// 设定圆环的环绕次数
const tubularSegments = 64

// 设定圆环的环绕次数
const p = 2

// 设定圆环的环绕次数
const q = 3

// 创建一个 TorusKnotGeometry 实例
const myTorusKnot = new TorusKnotGeometry(radius, tubeRadius, tubularSegments, radialSegments, p, q)

// 导出 TorusKnotGeometry 实例
export default myTorusKnot
