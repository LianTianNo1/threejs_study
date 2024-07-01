import { CylinderGeometry } from "three"

// 设定圆柱体半径
const radiusTop = 5

// 设定圆柱体半径
const radiusBottom = 5

// 设定圆柱体高度
const height = 10

// 设定圆柱体细分
const segments = 32

// 创建圆柱体几何体
const myCylinder = new CylinderGeometry(radiusTop, radiusBottom, height, segments)

// 导出圆柱体几何体
export default myCylinder
