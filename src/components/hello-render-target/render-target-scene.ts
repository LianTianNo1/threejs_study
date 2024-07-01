// 导入 Three.js 库，并使用别名 Three
import * as Three from 'three'

// 创建一个场景
const scene = new Three.Scene()
// 设置场景的背景颜色为青色（#00FFFF）
scene.background = new Three.Color(0x00FFFF)

// 创建一个透视相机
const camera = new Three.PerspectiveCamera(45, 1, 0.1, 10)
// 设置相机的位置，z 轴方向为 10
camera.position.z = 10

// 创建一个方向光，颜色为白色，强度为 1
const light = new Three.DirectionalLight(0xFFFFFF, 1)
// 设置光源的位置，x 轴方向为 0，y 轴方向为 10，z 轴方向为 10
light.position.set(0, 10, 10)
// 将光源添加到场景中
scene.add(light)

// 定义颜色数组，包含蓝色、红色、绿色
const colors = ['blue', 'red', 'green']
// 创建一个空数组，用于存储立方体网格
const boxs: Three.Mesh[] = []

// 遍历颜色数组，创建不同颜色的立方体
colors.forEach((color, index) => {
    // 创建一个 Phong 材质，颜色为当前遍历到的颜色
    const mat = new Three.MeshPhongMaterial({ color })
    // 创建一个立方体几何体，边长为 2
    const geo = new Three.BoxGeometry(2, 2, 2)
    // 创建一个网格，使用立方体几何体和 Phong 材质
    const mesh = new Three.Mesh(geo, mat)
    // 设置网格的位置，x 轴方向为 (index - 1) * 3，根据索引值调整位置
    mesh.position.x = (index - 1) * 3
    // 将网格添加到场景中
    scene.add(mesh)
    // 将网格添加到 boxs 数组中
    boxs.push(mesh)
})

// 导出场景、立方体数组和相机
export default {
    scene,
    boxs,
    camera
}
