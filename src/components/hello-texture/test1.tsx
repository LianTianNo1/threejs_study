// 加载一张图，实现一个有贴图的立方体
import { useEffect, useRef } from 'react'
import * as Three from 'three'
import './index.scss'
import imgSrc from '@/assets/imgs/mapping.png' //引入图片资源

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

        //创建一个 纹理加载器
        const loader = new Three.TextureLoader()
        //创建一个材质，材质的 map 属性值为 纹理加载器加载的图片资源
        const material = new Three.MeshBasicMaterial({
            map: loader.load(imgSrc) //loader.load('xxx.jpg')返回值为Three.Text类型实例
        })

        const box = new Three.BoxGeometry(4, 4, 4)
        const mesh = new Three.Mesh(box, material)
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

export default HelloTexture;
