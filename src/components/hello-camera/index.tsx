import { useRef, useEffect, useState } from 'react'
import * as Three from 'three'
import { solarSystem, earthOrbit, moonOribit, pointLight } from '@/components/hello-scene/create-something'

import './index.scss'

const nodeArr = [solarSystem, earthOrbit, moonOribit] //太阳、地球、月亮对应的网格

const HelloCamera = () => {

    const leftViewRef = useRef<HTMLDivElement>(null)
    const rightViewRef = useRef<HTMLDivElement>(null)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rendererRef = useRef<Three.WebGLRenderer | null>(null)

    const leftCameraRef = useRef<Three.PerspectiveCamera | Three.OrthographicCamera | null>(null)
    const rightCameraRef = useRef<Three.PerspectiveCamera | null>(null)
    const sceneRef = useRef<Three.Scene | null>(null)

    const [cameraType, setCameraType] = useState<'PerspectiveCamera' | 'OrthographicCamera'>('PerspectiveCamera')

    useEffect(() => {

        //创建渲染器
        const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current as HTMLCanvasElement })
        renderer.setClearColor(0x000000)
        rendererRef.current = renderer

        //创建左侧镜头
        let leftCamera: Three.PerspectiveCamera | Three.OrthographicCamera
        if (cameraType === 'PerspectiveCamera') {
            //透视镜头
            leftCamera = new Three.PerspectiveCamera(45, 2, 5, 100) //透视相机(视野角度, 宽高比, 近截面, 远截面)
            leftCamera.position.set(0, 10, 20)
        } else {
            //正交镜头
            leftCamera = new Three.OrthographicCamera(-1, 1, 1, -1, 5, 50) //正交相机(左视锥体面, 右视锥体面, 顶视锥体面, 底视锥体面, 近截面, 远截面)
            leftCamera.zoom = 0.2
            leftCamera.position.set(0, 10, 20)
        }
        leftCameraRef.current = leftCamera

        //创建右侧镜头
        const rightCamera = new Three.PerspectiveCamera(60, 2, 0.1, 1000) //透视相机(视野角度, 宽高比, 近截面, 远截面)
        rightCamera.position.set(0, 50, 0)
        rightCamera.up.set(0, 0, 1)
        rightCamera.lookAt(0, 0, 0)
        rightCameraRef.current = rightCamera

        //创建场景
        const scene = new Three.Scene()
        scene.background = new Three.Color(0x111111)
        sceneRef.current = scene

        //将太阳系、灯光添加到场景中
        // scene.add(solarSystem)

        // 添加一个立方体
        const cube = new Three.Mesh(new Three.BoxGeometry(2, 1, 1), new Three.MeshPhongMaterial({ color: 0xff0000 }))
        cube.position.set(0, 0, 0)
        scene.add(cube)


        scene.add(pointLight)

        //左侧镜头辅助对象
        const leftCameraHelper = new Three.CameraHelper(leftCamera)
        scene.add(leftCameraHelper)

        //创建循环渲染的动画
        const render = (time: number) => {
            time = time * 0.001
            nodeArr.forEach((item) => {
                item.rotation.y = time
            })

            //左侧渲染
            const leftAspect = setScissorForElement(leftViewRef.current as HTMLDivElement)
            if (cameraType === 'PerspectiveCamera') {
                //透视镜头
                // @ts-ignore
                leftCamera.aspect = leftAspect as number
            } else {
                //正交镜头
                // @ts-ignore
                leftCamera.left = -(leftAspect as number)
                // @ts-ignore
                leftCamera.right = leftAspect as number
            }
            leftCamera.updateProjectionMatrix()
            renderer.setScissorTest(true)
            renderer.render(scene, leftCamera)

            //右侧渲染
            const rightAspect = setScissorForElement(rightViewRef.current as HTMLDivElement)
            rightCamera.aspect = rightAspect as number
            rightCamera.updateProjectionMatrix()
            renderer.setScissorTest(true)
            renderer.render(scene, rightCamera)

            window.requestAnimationFrame(render)
        }
        window.requestAnimationFrame(render)

        //添加窗口尺寸变化的监听
        const resizeHandle = () => {
            const canvas = renderer.domElement
            renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
        }
        resizeHandle()
        window.addEventListener('resize', resizeHandle)

        return () => {
            window.removeEventListener('resize', resizeHandle)
        }
    }, [cameraType])

    //设置裁剪区域
    const setScissorForElement = (el: HTMLDivElement) => {
        const canvasRect = (canvasRef.current as HTMLCanvasElement).getBoundingClientRect()
        const elemRect = el.getBoundingClientRect()

        //计算当前元素的相对位置以及宽高比
        const right = Math.min((elemRect.left + elemRect.width) - canvasRect.left, canvasRect.width)
        const left = Math.max(0, elemRect.left - canvasRect.left)
        const bottom = Math.min((elemRect.top + elemRect.height) - canvasRect.top, canvasRect.height)
        const top = Math.max(0, elemRect.top - canvasRect.top)
        const width = Math.min(canvasRect.width - left, right - left)
        const height = Math.min(canvasRect.height - top, bottom - top)

        //设置渲染器的视口、裁剪区域
        rendererRef.current?.setScissor(left, top, width, height)
        rendererRef.current?.setViewport(left, top, width, height)

        //返回当前元素的宽高比
        return width / height
    }

    return (
        <div className='container'>
            <div className='view' ref={leftViewRef}>
                <canvas ref={canvasRef} className='full-screen' />
            </div>
            <div className='view' ref={rightViewRef}></div>
            <div>
                <button onClick={() => setCameraType('PerspectiveCamera')}>透视镜头</button>
                <button onClick={() => setCameraType('OrthographicCamera')}>正交镜头</button>
            </div>
        </div>
    )
}

export default HelloCamera
