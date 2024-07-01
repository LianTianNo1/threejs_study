import { ShapeGeometry } from "three"
import { Shape } from "three"

// 创建一个二维形状
const shape = new Shape()
shape.moveTo(0, 0)
shape.lineTo(10, 0)
shape.lineTo(10, 10)
shape.lineTo(0, 10)
shape.lineTo(0, 0)

// 创建一个 ShapeGeometry 实例
const myShape = new ShapeGeometry(shape)

// 导出 ShapeGeometry 实例
export default myShape
