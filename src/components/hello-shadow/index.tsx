import { useEffect, useRef } from 'react'
import * as Three from 'three' // 引入 Three.js 库
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' // 引入轨道控制器

import './index.scss' // 引入样式文件

const HelloShadow = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null) // 创建一个 ref 用于引用 canvas 元素

    useEffect(() => {
        // 当 canvasRef.current 不为空时，执行渲染逻辑
        if (canvasRef.current === null) {
            return
        }

        // 创建渲染器
        const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current })
        // 启用阴影贴图
        renderer.shadowMap.enabled = true

        // 创建场景
        const scene = new Three.Scene()
        // 设置场景背景颜色
        scene.background = new Three.Color(0x333333)

        // 创建主相机
        const camera = new Three.PerspectiveCamera(45, 2, 5, 100)
        // 设置相机位置
        camera.position.set(0, 10, 20)
        // 将相机添加到场景中
        scene.add(camera)

        // 创建辅助相机，用于观察阴影效果
        const helperCamera = new Three.PerspectiveCamera(45, 2, 5, 100)
        // 设置辅助相机位置
        helperCamera.position.set(20, 10, 20)
        // 设置辅助相机看向目标点
        helperCamera.lookAt(0, 5, 0)
        // 将辅助相机添加到场景中
        scene.add(helperCamera)

        // 创建辅助相机帮助线
        const cameraHelper = new Three.CameraHelper(helperCamera)
        // 将辅助相机帮助线添加到场景中
        scene.add(cameraHelper)

        // 创建轨道控制器
        const controls = new OrbitControls(camera, canvasRef.current)
        // 设置轨道控制器目标点
        controls.target.set(0, 5, 0)
        // 更新轨道控制器
        controls.update()

        // 创建方向光
        const light = new Three.DirectionalLight(0xFFFFFF, 1)
        // 启用方向光阴影
        light.castShadow = true
        // 设置方向光位置
        light.position.set(0, 10, 0)
        // 设置方向光目标点
        light.target.position.set(-4, 0, -4)
        // 将方向光添加到场景中
        scene.add(light)
        // 将方向光目标点添加到场景中
        scene.add(light.target)

        // 获取方向光阴影相机
        const shadowCamera = light.shadow.camera
        // 设置阴影相机范围
        shadowCamera.left = -10
        shadowCamera.right = 10
        shadowCamera.top = 10
        shadowCamera.bottom = -10
        // 更新阴影相机投影矩阵
        shadowCamera.updateProjectionMatrix()

        // 创建方向光帮助线
        const lightHelper = new Three.DirectionalLightHelper(light)
        // 将方向光帮助线添加到场景中
        scene.add(lightHelper)

        // 创建阴影相机帮助线
        const shadowHelper = new Three.CameraHelper(shadowCamera)
        // 将阴影相机帮助线添加到场景中
        scene.add(shadowHelper)

        // 设置地面大小
        const planeSize = 40

        // 创建纹理加载器
        const loader = new Three.TextureLoader()
        // 加载纹理
        const texture = loader.load(require('@/assets/imgs/checker.png'))
        // 设置纹理重复模式
        texture.wrapS = Three.RepeatWrapping
        texture.wrapT = Three.RepeatWrapping
        // 设置纹理过滤模式
        texture.magFilter = Three.NearestFilter
        // 设置纹理重复次数
        texture.repeat.set(planeSize / 2, planeSize / 2)

        // 创建地面几何体
        const planGeo = new Three.PlaneGeometry(planeSize, planeSize)
        // 创建地面材质
        const planeMat = new Three.MeshPhongMaterial({
            map: texture, // 设置地面纹理
            side: Three.DoubleSide // 设置地面两面可见
        })
        // 创建地面网格
        const planeMesh = new Three.Mesh(planGeo, planeMat)
        // 设置地面接收阴影
        planeMesh.receiveShadow = true
        // 设置地面旋转角度
        planeMesh.rotation.x = Math.PI * -0.5
        // 将地面添加到场景中
        scene.add(planeMesh)

        // 创建材质
        const material = new Three.MeshPhongMaterial({
            color: 0x88AACC // 设置材质颜色
        })
        // 创建立方体几何体
        const boxMat = new Three.BoxGeometry(4, 4, 4)
        // 创建立方体网格
        const boxMesh = new Three.Mesh(boxMat, material)
        // 设置立方体投射阴影
        boxMesh.castShadow = true
        // 设置立方体接收阴影
        boxMesh.receiveShadow = true
        // 设置立方体位置
        boxMesh.position.set(5, 3, 0)
        // 将立方体添加到场景中
        scene.add(boxMesh)

        // 创建球体几何体
        const sphereMat = new Three.SphereGeometry(3, 32, 16)
        // 创建球体网格
        const sphereMesh = new Three.Mesh(sphereMat, material)
        // 设置球体投射阴影
        sphereMesh.castShadow = true
        // 设置球体接收阴影
        sphereMesh.receiveShadow = true
        // 设置球体位置
        sphereMesh.position.set(-4, 5, 0)
        // 将球体添加到场景中
        scene.add(sphereMesh)

        // 渲染函数
        const render = () => {
            // 更新辅助相机帮助线
            cameraHelper.update()
            // 更新方向光帮助线
            lightHelper.update()
            // 更新阴影相机帮助线
            shadowHelper.update()

            // 渲染场景
            renderer.render(scene, camera)
            // 继续渲染下一帧
            window.requestAnimationFrame(render)
        }
        // 开始渲染
        window.requestAnimationFrame(render)

        // 窗口大小改变事件处理函数
        const handleResize = () => {
            // 当 canvasRef.current 不为空时，执行窗口大小改变逻辑
            if (canvasRef.current === null) {
                return
            }

            // 获取 canvas 宽度和高度
            const width = canvasRef.current.clientWidth
            const height = canvasRef.current.clientHeight

            // 设置相机纵横比
            camera.aspect = width / height
            // 更新相机投影矩阵
            camera.updateProjectionMatrix()

            // 设置渲染器大小
            renderer.setSize(width, height, false)
        }
        // 执行窗口大小改变事件处理函数
        handleResize()
        // 添加窗口大小改变事件监听
        window.addEventListener('resize', handleResize)

        // 返回一个清理函数，用于在组件卸载时移除事件监听
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [canvasRef]) // 依赖数组，当 canvasRef 发生变化时，重新执行 useEffect

    return (
        <canvas ref={canvasRef} className='full-screen' /> // 返回一个 canvas 元素
    )
}

export default HelloShadow
