import { TorusGeometry } from "three"

// 设定圆环半径
const radius = 5

// 设定圆环管子的半径
const tubeRadius = 2

// 设定圆环细分
const radialSegments = 16

// 设定圆环细分
const tubularSegments = 8

// 创建一个 TorusGeometry 实例
const myTorus = new TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments)

// 导出 TorusGeometry 实例
export default myTorus
