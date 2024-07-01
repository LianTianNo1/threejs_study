import { CircleGeometry } from "three"

// 设定圆形半径
const radius = 5

// 设定圆形细分
const segments = 32

// 创建圆形几何体
const myCircle = new CircleGeometry(radius, segments)

// 导出圆形几何体
export default myCircle
