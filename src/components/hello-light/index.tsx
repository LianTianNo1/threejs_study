import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';

import "./index.scss";
import * as Three from "three";

// 创建一个简单的立方体
const createCube = (color: THREE.Color) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color });
  return new THREE.Mesh(geometry, material);
};

// 创建一个简单的球体
const createSphere = (color: THREE.Color) => {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshPhongMaterial({ color });
  return new THREE.Mesh(geometry, material);
};

// 创建一个简单的平面
const createPlane = () => {
  const geometry = new THREE.PlaneGeometry(10, 10);
  //   const material = new THREE.MeshPhongMaterial({ color });
  const textureLoader = new Three.TextureLoader();
  const texture = textureLoader.load(require("@/assets/imgs/mapping.png"));
  const material = new THREE.MeshPhongMaterial({ map: texture });

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;

  return new THREE.Mesh(geometry, material);
};

const HelloLight = () => {
  const canvasRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);

  const [lightType, setLightType] = useState<string>("ambientLight");

  useEffect(() => {
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
    rendererRef.current = renderer;

    // 创建镜头
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);
    cameraRef.current = camera;

    // 创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    sceneRef.current = scene;

    // 添加轨道控制
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 创建灯光
    const createLights = () => {
      scene.remove(
        ...scene.children.filter(
          (child) =>
            child.type === "Light" ||
            child.type === "DirectionalLightHelper" ||
            child.type === "HemisphereLightHelper" ||
            child.type === "PointLightHelper" ||
            child.type === "SpotLightHelper" ||
            child.type === "RectAreaLightHelper"
        )
      );
      switch (lightType) {
        case "ambientLight": {
          // 环境光，全局光照
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 色彩和强度
          scene.add(ambientLight);
          break;
        }
        case "directionalLight": {
          // 平行光，模拟太阳光
          const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 色彩和强度
          directionalLight.position.set(2, 2, 2); // 设置光源位置
          directionalLight.target.position.set(0, 0, 0); // 设置光源照射目标
          scene.add(directionalLight);
          // 添加辅助对象，方便观察光源位置和方向
          scene.add(new THREE.DirectionalLightHelper(directionalLight, 1));
          break;
        }
        case "hemisphereLight": {
          // 半球光，模拟天空和地面光照
          const hemisphereLight = new THREE.HemisphereLight(
            0xffffbb,
            0x080820,
            1
          ); // 天空颜色，地面颜色，强度
          scene.add(hemisphereLight);
          // 添加辅助对象，方便观察光源位置和方向
          scene.add(new THREE.HemisphereLightHelper(hemisphereLight, 1));
          break;
        }
        case "pointLight": {
          // 点光源，类似于灯泡
          const pointLight = new THREE.PointLight(0xffffff, 1, 10); // 色彩，强度，距离
          pointLight.position.set(0, 2, 0);
          scene.add(pointLight);
          // 添加辅助对象，方便观察光源位置和方向
          scene.add(new THREE.PointLightHelper(pointLight, 1));
          break;
        }
        // 矩形面光源
        // 这个功能在three.js的r129版本中已经被移除，如果需要使用矩形面光源，可以使用three.js的r128版本
        // case 'rectAreaLight': {
        //   // 矩形面光源，模拟窗户或矩形照明
        //   RectAreaLightUniformsLib.init(); // 初始化必要的uniform变量
        //   const rectAreaLight = new THREE.RectAreaLight(0xffffff, 10, 2, 2); // 色彩，强度，宽度，高度
        //   rectAreaLight.position.set(0, 2, 0);
        //   scene.add(rectAreaLight);
        //   // 添加辅助对象，方便观察光源位置和方向
        //   scene.add(new THREE.RectAreaLightHelper(rectAreaLight));
        //   break;
        // }
        case "spotLight": {
          // 聚光灯，类似于手电筒
          const spotLight = new THREE.SpotLight(
            0xffffff,
            1,
            10,
            Math.PI / 4,
            0.5
          ); // 色彩，强度，距离，角度，衰减
          spotLight.position.set(2, 2, 2);
          spotLight.target.position.set(0, 0, 0);
          scene.add(spotLight);
          // 添加辅助对象，方便观察光源位置和方向
          scene.add(new THREE.SpotLightHelper(spotLight));
          break;
        }
        default:
          break;
      }
    };

    // 创建物体
    const cube = createCube(new THREE.Color(0xff0000)); // 红色立方体
    cube.position.set(-1, 0, 0);
    scene.add(cube);

    const sphere = createSphere(new THREE.Color(0x00ff00)); // 绿色球体
    sphere.position.set(1, 0, 0);
    scene.add(sphere);

    const plane = createPlane(); // 蓝色平面
    plane.rotation.x = -Math.PI / 2; // 平面旋转90度
    scene.add(plane);

    // 创建灯光
    createLights();

    // 渲染循环
    const render = () => {
      controls.update(); // 更新轨道控制
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };
    render();

    // 窗口大小变化监听
    const resizeHandle = () => {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    };
    resizeHandle();
    window.addEventListener("resize", resizeHandle);

    return () => {
      window.removeEventListener("resize", resizeHandle);
    };
  }, [lightType]);

  return (
    <div>
      <h1>Three.js灯光示例</h1>
      <div className="light-buttons">
        <button onClick={() => setLightType("ambientLight")}>环境光</button>
        <button onClick={() => setLightType("directionalLight")}>平行光</button>
        <button onClick={() => setLightType("hemisphereLight")}>半球光</button>
        <button onClick={() => setLightType("pointLight")}>点光源</button>
        {/* <button onClick={() => setLightType('rectAreaLight')}>矩形面光源</button> */}
        <button onClick={() => setLightType("spotLight")}>聚光灯</button>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default HelloLight;
