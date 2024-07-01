import { PlaneGeometry } from "three"

// 设定平面的宽
const width = 10

// 设定平面的高
const height = 10

// 设定平面的细分
const widthSegments = 1

// 设定平面的细分
const heightSegments = 1

// 创建一个 PlaneGeometry 实例
const myPlane = new PlaneGeometry(width, height, widthSegments, heightSegments)

// 导出 PlaneGeometry 实例
export default myPlane
