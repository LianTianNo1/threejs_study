// 纹理的重复、偏移、旋转

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

        //设置纹理重复方式
        // texture.wrapS = Three.ClampToEdgeWrapping //每个边缘最后一个像素将永远重复
        // texture.wrapT = Three.ClampToEdgeWrapping //每个边缘最后一个像素将永远重复
        texture.wrapS = Three.RepeatWrapping //重复整个纹理
        texture.wrapT = Three.RepeatWrapping //重复整个纹理
        // texture.wrapS = Three.MirroredRepeatWrapping //纹理被镜像(对称反转)并重复
        // texture.wrapT = Three.MirroredRepeatWrapping //纹理被镜像(对称反转)并重复

        // //设置纹理重复次数
        texture.repeat.set(3, 3) //设置水平方向重复 2 次、垂直方向重复 3 次

        // //设置纹理偏移
        texture.offset.set(0.5, 0.25) //设置纹理水平方向偏移 0.5 个纹理宽度、垂直方向偏移 0.25 个纹理高度

        // //设置纹理旋转
        texture.center.set(0.5, 0.5) //将旋转中心点改为图片的正中心位置
        texture.rotation = Three.MathUtils.degToRad(45) //设置纹理旋转弧度

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
