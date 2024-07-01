import { ConeGeometry } from "three"

// 设定圆锥体半径
const radius = 5

// 设定圆锥体高度
const height = 10

// 设定圆锥体细分
const segments = 32

// 创建圆锥体几何体
const myCone = new ConeGeometry(radius, height, segments)

// 导出圆锥体几何体
export default myCone
