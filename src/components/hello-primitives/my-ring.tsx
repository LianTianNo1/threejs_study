import { RingGeometry } from "three"

// 设定圆环内半径
const innerRadius = 5

// 设定圆环外半径
const outerRadius = 10

// 设定圆环细分
const thetaSegments = 32

// 设定圆环细分
const phiSegments = 8

// 创建一个 RingGeometry 实例
const myRing = new RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments)

// 导出 RingGeometry 实例
export default myRing
