// 纹理的缩放模式
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
        const texture: Three.Texture = loader.load(imgSrc)
        //创建一个材质，材质的 map 属性值为 纹理加载器加载的图片资源
        const material = new Three.MeshBasicMaterial({
            map: texture
        })

        //设置纹理缩小模式
        texture.magFilter = Three.NearestFilter //最接近模式
        // texture.magFilter = Three.LinearFilter //线性模式

        //设置纹理放大模式
        // texture.minFilter = Three.NearestFilter //最接近模式
        // texture.minFilter = Three.LinearFilter //线性模式
        // texture.minFilter = Three.NearestMipmapNearestFilter //选择最贴近目标解析度的Mip，然后线性过滤器将其渲染
        // texture.minFilter = Three.NearestMipmapLinearFilter //选择层次最近的2个Mip，将2个Mip使用线性模式将其混合
        // texture.minFilter = Three.LinearMipmapNearestFilter //选择最贴近目标解析度的1个Mip，然后使用线性模式将其混合
        texture.minFilter = Three.LinearMipmapLinearFilter //选择层次最近的2个Mip，然后使用线性模式将其混合

        const box = new Three.BoxGeometry(8, 8, 8)
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

export default HelloTexture
