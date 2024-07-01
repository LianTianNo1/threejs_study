import { useRef, useEffect } from 'react';
import * as Three from 'three';
import './index.scss';

// 材质示例组件
const MaterialExamples = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Three.WebGLRenderer | null>(null);
  const cameraRef = useRef<Three.PerspectiveCamera | null>(null);
  const sceneRef = useRef<Three.Scene | null>(null);

  useEffect(() => {
    // 创建渲染器
    const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current as HTMLCanvasElement });
    rendererRef.current = renderer;

    // 创建镜头
    const camera = new Three.PerspectiveCamera(45, 2, 0.1, 1000);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 创建场景
    const scene = new Three.Scene();
    sceneRef.current = scene;

    // 创建光源
    const ambientLight = new Three.AmbientLight(0xffffff, 0.5); // 环境光
    scene.add(ambientLight);
    const directionalLight = new Three.DirectionalLight(0xffffff, 0.8); // 方向光
    directionalLight.position.set(1, 1, 6);
    scene.add(directionalLight);

    // 创建几何体
    const geometry = new Three.BoxGeometry(0.2, 0.2, 0.2); // 立方体几何体
    // 几何体变小一点
    // geometry.scale(0.5, 0.5, 0.5);

    // 创建材质示例
    const materials = [
      // 基础材质
      new Three.MeshBasicMaterial({
        color: 0xff0000, // 颜色
        side: Three.DoubleSide, // 显示双面
      }),
      new Three.MeshLambertMaterial({
        color: 0x00ff00, // 颜色
        emissive: 0x0000ff, // 发光颜色
      }),
      new Three.MeshPhongMaterial({
        color: 0x0000ff, // 颜色
        emissive: 0xff0000, // 发光颜色
        shininess: 100, // 光泽度
      }),
      new Three.MeshToonMaterial({
        color: 0xffff00, // 颜色
        gradientMap: null, // 渐变贴图
      }),
      new Three.MeshMatcapMaterial({
        matcap: null, // 材质贴图
      }),
      new Three.MeshStandardMaterial({
        color: 0xffffff, // 颜色
        roughness: 0.5, // 粗糙度
        metalness: 0.5, // 金属度
      }),
      new Three.MeshPhysicalMaterial({
        color: 0x000000, // 颜色
        roughness: 0.2, // 粗糙度
        metalness: 0.8, // 金属度
        clearcoat: 0.5, // 清漆程度
        clearcoatRoughness: 0.2, // 清漆粗糙度
      }),

      // 特殊材质
      new Three.ShadowMaterial({
        opacity: 0.5, // 透明度
      }),
    //   new Three.MeshDistanceMaterial({
    //     referencePosition: new Three.Vector3(0, 0, 0), // 参考位置
    //     nearDistance: 1, // 近距离
    //     farDistance: 10, // 远距离
    //   }),
    //   new Three.MeshDepthMaterial({
    //     depthPacking: Three.RGBADepthPacking, // 深度打包方式
    //   }),
    //   new Three.MeshNormalMaterial({
    //     flatShading: true, // 平面着色
    //   }),
    //   new Three.SpriteMaterial({
    //     map: null, // 纹理贴图
    //     color: 0xffffff, // 颜色
    //   }),

      // 自定义材质
      new Three.ShaderMaterial({
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          void main() {
            gl_FragColor = vec4(vUv, 0.0, 1.0);
          }
        `,
      }),
      new Three.RawShaderMaterial({
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          void main() {
            gl_FragColor = vec4(vUv, 0.0, 1.0);
          }
        `,
      }),
    ];

    // 创建网格
    const meshes = materials.map((material, index) => {
        const mesh = new Three.Mesh(geometry, material);
        // 计算网格位置
        const row = Math.floor(index / 3);
        const col = index % 3;
        const x = col * 1.5 - 1;
        const y = -row * 1.5 + 1;
        mesh.position.set(x, y, 0);
        // mesh.position.set(col * 0.4 - 0.4, -row * 2 + 1, 0);
        return mesh;
      });


    // 将网格添加到场景中
    meshes.forEach((mesh) => {
      scene.add(mesh);
    });

    // 创建循环渲染的动画
    const render = () => {
        // 让每个立方体都绕着自己的 Y/X 轴旋转
        meshes.forEach((mesh) => {
          mesh.rotation.y += 0.001;
          mesh.rotation.x += 0.001;
        });
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };
    render();

    // 添加窗口尺寸变化的监听
    const resizeHandle = () => {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    };
    resizeHandle();
    window.addEventListener('resize', resizeHandle);

    return () => {
      window.removeEventListener('resize', resizeHandle);
    };
  }, [canvasRef]);

  return <canvas ref={canvasRef} className="full-screen" />;
};

export default MaterialExamples;
