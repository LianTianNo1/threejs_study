import { ExtrudeGeometry } from "three"
import { Shape } from "three"

// 创建一个二维形状
const shape = new Shape()
shape.moveTo(0, 0)
shape.lineTo(10, 0)
shape.lineTo(10, 10)
shape.lineTo(0, 10)
shape.lineTo(0, 0)

// 创建 ExtrusionSettings 对象，设置挤压参数
const extrusionSettings = {
  depth: 5, // 挤压深度
  bevelEnabled: true, // 是否启用倒角
  bevelThickness: 1, // 倒角厚度
  bevelSize: 1, // 倒角尺寸
  bevelSegments: 3 // 倒角细分
}

// 创建 ExtrudeGeometry 实例
const myExtrude = new ExtrudeGeometry(shape, extrusionSettings)

// 导出 ExtrudeGeometry 实例
export default myExtrude
