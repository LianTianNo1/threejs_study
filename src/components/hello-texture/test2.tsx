// 加载多张图片，实现一个骰子
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

        //创建一个 纹理加载器
        const loader = new Three.TextureLoader()

        //创建 6 个面对应的材质
        const materialArr: Three.MeshBasicMaterial[] = []
        for (let i = 0; i < 6; i++) {
            console.log("看看", `@/assets/imgs/dice${i}.png`)
            materialArr.push(new Three.MeshBasicMaterial({
                map: loader.load(require(`@/assets/imgs/dice${i}.png`))
            }))
        }
        // const testMaterial = new Three.MeshBasicMaterial({
        //     map: loader.load(require(`@/assets/imgs/dice0.png`))
        // })

        const box = new Three.BoxGeometry(8, 8, 8)
        // const mesh = new Three.Mesh(box, testMaterial) //注意，此处使用的不再是单个材质，而是一个材质数组
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
