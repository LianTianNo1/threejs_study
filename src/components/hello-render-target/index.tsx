import { useEffect, useRef } from 'react' // 引入 React 的 useEffect 和 useRef 钩子
import * as Three from 'three' // 引入 Three.js 库
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' // 引入 OrbitControls 用于控制相机
import * as RTScene from './render-target-scene' // 引入 render-target-scene 模块

import './index.scss' // 引入样式文件

const HelloRenderTarget = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null) // 创建一个 useRef 钩子，用于存储 canvas 元素的引用

    useEffect(() => {
        // useEffect 钩子，在组件挂载后执行
        if (canvasRef.current === null) {
            // 如果 canvasRef.current 为空，则返回，不做任何操作
            return
        }

        // 从 render-target-scene 模块中获取场景、盒子和相机
        const rtScene = RTScene.default.scene
        const rtBoxs = RTScene.default.boxs
        const rtCamera = RTScene.default.camera

        // 创建 WebGL 渲染器，并指定 canvas 元素
        const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current })
        // 创建一个 WebGLRenderTarget 对象，用于渲染到纹理
        const rendererTarget = new Three.WebGLRenderTarget(512, 512)

        // 创建一个 Three.js 场景
        const scene = new Three.Scene()
        // 设置场景背景颜色为灰色
        scene.background = new Three.Color(0x333333)

        // 创建一个方向光源，并设置颜色和位置
        const light = new Three.DirectionalLight(0xFFFFFF, 1)
        light.position.set(0, 10, 10)
        light.target.position.set(-2, 2, 2)
        // 将光源添加到场景中
        scene.add(light)
        // 将光源的目标添加到场景中
        scene.add(light.target)

        // 创建一个透视相机，并设置参数
        const camera = new Three.PerspectiveCamera(45, 2, 0.1, 100)
        camera.position.z = 15

        // 创建一个 OrbitControls 对象，用于控制相机
        const controls = new OrbitControls(camera, canvasRef.current)
        // 更新 OrbitControls
        controls.update()

        // 创建一个 Phong 材质，并设置纹理为 rendererTarget 的纹理
        const material = new Three.MeshPhongMaterial({
            map: rendererTarget.texture
        })

        // 创建一个立方体几何体
        const cubeGeo = new Three.BoxGeometry(4, 4, 4)
        // 创建一个立方体网格，并设置材质
        const cubeMesh = new Three.Mesh(cubeGeo, material)
        // 设置立方体网格的位置
        cubeMesh.position.x = 4
        // 将立方体网格添加到场景中
        scene.add(cubeMesh)

        // 创建一个圆形几何体
        const circleGeo = new Three.CircleGeometry(2.8, 36)
        // 创建一个圆形网格，并设置材质
        const circleMesh = new Three.Mesh(circleGeo, material)
        // 设置圆形网格的位置
        circleMesh.position.x = -4
        // 将圆形网格添加到场景中
        scene.add(circleMesh)

        // 渲染函数
        const render = (time: number) => {
            // 将时间转换为秒
            time *= 0.001

            // 遍历每个盒子，并设置旋转
            rtBoxs.forEach((item) => {
                item.rotation.set(time, time, 0)
            })
            // 设置渲染目标为 rendererTarget
            renderer.setRenderTarget(rendererTarget)
            // 渲染 render-target-scene 场景
            renderer.render(rtScene, rtCamera)
            // 设置渲染目标为空，恢复默认渲染
            renderer.setRenderTarget(null)

            // 设置立方体网格的旋转
            cubeMesh.rotation.set(time, time, 0)
            // 渲染场景
            renderer.render(scene, camera)

            // 继续请求下一帧渲染
            window.requestAnimationFrame(render)
        }
        // 开始渲染
        window.requestAnimationFrame(render)

        // 窗口大小改变时的处理函数
        const handleResize = () => {
            if (canvasRef.current === null) {
                // 如果 canvasRef.current 为空，则返回，不做任何操作
                return
            }
            // 获取 canvas 元素的宽度和高度
            const width = canvasRef.current.clientWidth
            const height = canvasRef.current.clientHeight
            // 设置相机的纵横比
            camera.aspect = width / height
            // 更新相机的投影矩阵
            camera.updateProjectionMatrix()
            // 设置渲染器的尺寸
            renderer.setSize(width, height, false)
        }
        // 执行窗口大小改变时的处理函数
        handleResize()
        // 添加窗口大小改变事件监听器
        window.addEventListener('resize', handleResize)

        // 返回一个清理函数，在组件卸载时执行
        return () => {
            // 移除窗口大小改变事件监听器
            window.removeEventListener('resize', handleResize)
        }
    }, [canvasRef]) // useEffect 钩子的依赖项为 canvasRef


    return (
        // 返回一个 canvas 元素，并设置 ref 和样式
        <canvas ref={canvasRef} className='full-screen' />
    )
}

export default HelloRenderTarget
