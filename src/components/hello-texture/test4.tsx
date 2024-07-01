// 使用纹理加载管理器监控多个图片资源的加载
import { useEffect, useRef } from 'react'
import * as Three from 'three'

import './index.scss'

const HelloTexture = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (canvasRef.current === null) {
            return
        }

        const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current as HTMLCanvasElement })

        const camera = new Three.PerspectiveCamera(40, 2, 0.1, 1000)
        camera.position.set(0, 0, 40)

        const scene = new Three.Scene()
        scene.background = new Three.Color(0xcccccc)

        //创建所有纹理加载的管理器
        const loadingManager = new Three.LoadingManager()
        //创建一个 纹理加载器
        const loader = new Three.TextureLoader(loadingManager)
        //创建 6 个面对应的材质
        const materialArr: Three.MeshBasicMaterial[] = []
        for (let i = 0; i < 6; i++) {
            materialArr.push(new Three.MeshBasicMaterial({
                map: loader.load(require(`@/assets/imgs/dice${i}.png`))
            }))
        }

        //添加加载管理器的各种事件处理函数
        loadingManager.onLoad = () => {
            console.log('纹理图片资源加载完成')
        }
        loadingManager.onProgress = (url, loaded, total) => {
            console.log(`图片加载中, 共 ${total} 张，当前已加载 ${loaded} 张 ${url}`)
        }
        loadingManager.onError = (url) => {
            console.log(`加载失败 ${url}`)
        }

        const box = new Three.BoxGeometry(8, 8, 8)
        const mesh = new Three.Mesh(box, materialArr) //注意，此处使用的不再是单个材质，而是一个材质数组
        scene.add(mesh)

        const render = (time: number) => {
            time = time * 0.001

            mesh.rotation.x = time
            mesh.rotation.y = time
            renderer.render(scene, camera)

            window.requestAnimationFrame(render)
        }
        window.requestAnimationFrame(render)

        const resizeHandle = () => {
            const canvas = renderer.domElement
            camera.aspect = (canvas.clientWidth / canvas.clientHeight)
            camera.updateProjectionMatrix()
            renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
        }
        resizeHandle()
        window.addEventListener('resize', resizeHandle)

        return () => {
            window.removeEventListener('resize', resizeHandle)
        }
    }, [canvasRef])

    return (
        <canvas ref={canvasRef} className='full-screen' />
    )
}

export default HelloTexture
