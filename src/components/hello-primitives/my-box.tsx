import { BoxGeometry } from "three"

// 设定长宽高
const width = 8
const height = 8
const depth = 8

// 创建立方体几何体
const myBox = new BoxGeometry(width, height, depth)

// 导出立方体几何体
export default myBox
