import { SphereGeometry } from "three"

// 设定球体半径
const radius = 5

// 设定球体细分
const widthSegments = 32

// 设定球体细分
const heightSegments = 16

// 创建一个 SphereGeometry 实例
const mySphere = new SphereGeometry(radius, widthSegments, heightSegments)

// 导出 SphereGeometry 实例
export default mySphere
