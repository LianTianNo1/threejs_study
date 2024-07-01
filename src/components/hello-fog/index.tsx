import { useEffect, useRef } from 'react' // 引入 React 的 useEffect 和 useRef 钩子，用于处理副作用和引用 DOM 元素
import * as Three from 'three' // 引入 Three.js 库，用于创建 3D 场景
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' // 引入 OrbitControls，用于控制相机视角

import './index.scss' // 引入 CSS 文件，用于设置样式

// 定义一个名为 HelloFog 的函数组件，用于渲染 3D 场景
const HelloFog = () => {

    // 创建一个 useRef 钩子，用于引用 canvas 元素
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // 使用 useEffect 钩子，在组件挂载后执行一些副作用操作
    useEffect(() => {

        // 检查 canvasRef 是否为空，如果为空则直接返回
        if (canvasRef.current === null) {
            return
        }

        // 创建一个 WebGLRenderer 对象，用于渲染 3D 场景
        const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current }) // 使用 canvasRef.current 作为渲染目标

        // 创建一个 Scene 对象，用于存放 3D 场景中的所有物体
        const scene = new Three.Scene()
        // 设置场景背景颜色为蓝色
        scene.background = new Three.Color(0xadd8e6)
        // 添加雾效，使用线性雾
        scene.fog = new Three.Fog(0xadd8e6, 1, 2) // 设置雾的颜色、起始距离和结束距离
        //scene.fog = new Three.FogExp2(0xadd8e6,0.8) // 使用指数雾，设置雾的颜色和密度

        // 创建一个 PerspectiveCamera 对象，用于模拟人眼视角
        const camera = new Three.PerspectiveCamera(75, 2, 0.1, 5) // 设置视角、宽高比、近裁剪面和远裁剪面
        // 设置相机位置，向 Z 轴方向移动 2 个单位
        camera.position.z = 2

        // 创建一个 OrbitControls 对象，用于控制相机视角
        const controls = new OrbitControls(camera, canvasRef.current) // 使用 camera 和 canvasRef.current 作为参数
        // 更新 OrbitControls，使其生效
        controls.update()

        // 创建一个 DirectionalLight 对象，用于模拟方向光
        const light = new Three.DirectionalLight(0XFFFFFF, 1) // 设置光线颜色和强度
        // 设置光源位置
        light.position.set(-1, 2, 4)
        // 将光源添加到场景中
        scene.add(light)

        // 定义一个颜色数组，用于创建不同颜色的立方体
        const colors = ['blue', 'red', 'green']
        // 创建一个空数组，用于存放所有立方体
        const boxs: Three.Mesh[] = []

        // 遍历颜色数组，创建不同颜色的立方体
        colors.forEach((color, index) => {
            // 创建一个 MeshPhongMaterial 对象，用于设置立方体的材质
            const mat = new Three.MeshPhongMaterial({ color }) // 设置材质颜色
            // 创建一个 BoxBufferGeometry 对象，用于创建立方体的几何形状
            const geo = new Three.BoxGeometry(1, 1, 1) // 设置立方体的尺寸
            // 创建一个 Mesh 对象，用于将几何形状和材质组合在一起
            const mesh = new Three.Mesh(geo, mat)
            // 设置立方体的位置，每个立方体在 X 轴方向上间隔 2 个单位
            mesh.position.set((index - 1) * 2, 0, 0)
            // 将立方体添加到场景中
            scene.add(mesh)
            // 将立方体添加到 boxs 数组中
            boxs.push(mesh)
        })

        // 定义一个渲染函数，用于渲染 3D 场景
        const render = (time: number) => {
            // 将时间转换为秒
            time *= 0.001

            // 遍历所有立方体，更新其旋转角度
            boxs.forEach((box) => {
                box.rotation.x = time
                box.rotation.y = time
            })

            // 使用 renderer 渲染场景和相机
            renderer.render(scene, camera)
            // 使用 requestAnimationFrame 循环调用 render 函数，实现动画效果
            window.requestAnimationFrame(render)
        }
        // 首次调用 render 函数，开始渲染动画
        window.requestAnimationFrame(render)

        // 定义一个窗口大小改变事件处理函数
        const handleResize = () => {
            // 检查 canvasRef 是否为空，如果为空则直接返回
            if (canvasRef.current === null) {
                return
            }
            // 获取 canvas 元素的宽度和高度
            const width = canvasRef.current.clientWidth
            const height = canvasRef.current.clientHeight
            // 更新相机宽高比
            camera.aspect = width / height
            // 更新相机投影矩阵
            camera.updateProjectionMatrix()
            // 更新渲染器的大小
            renderer.setSize(width, height, false)
        }
        // 首次调用 handleResize 函数，设置初始大小
        handleResize()
        // 添加窗口大小改变事件监听器
        window.addEventListener('resize', handleResize)

        // 返回一个清理函数，用于在组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [canvasRef]) // useEffect 的依赖项为 canvasRef，当 canvasRef 发生变化时，useEffect 会重新执行

    // 返回一个 canvas 元素，并将其引用到 canvasRef
    return (
        <canvas ref={canvasRef} className='full-screen' /> // 使用 className 设置 canvas 元素的样式
    )
}

// 导出 HelloFog 组件
export default HelloFog
