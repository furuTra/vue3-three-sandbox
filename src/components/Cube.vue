<template>
  <div ref="container" style="width: 589px; height: 589px"></div>
</template>

<script lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  props: {
    color: {
      type: String,
      default: "#2e8b57",
    },
  },
  setup(props) {
    const container = ref(null);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    const grid = new THREE.GridHelper();
    const axes = new THREE.AxesHelper(10);

    // create a cube
    const cubeMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0.8,
      roughness: 0,
      color: new THREE.Color(props.color),
    });
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(7, 5, 5);

    const init = () => {
      if (container.value instanceof HTMLElement) {
        const { clientWidth, clientHeight } = container.value;

        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        camera.position.set(10, 10, 0);
        camera.lookAt(0, 0, 0);

        scene.add(spotLight);
        scene.add(grid);
        scene.add(axes);
        scene.add(cube);

        renderer.setClearColor(new THREE.Color(0xeeeeee));
        renderer.setSize(clientWidth, clientWidth);
        renderer.setPixelRatio(clientWidth / clientHeight);
        renderer.shadowMap.enabled = true;

        container.value.appendChild(renderer.domElement);
      }
    };

    const animate = () => {
      const frame = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
      };
      frame();
    };

    onMounted(() => {
      init();
      animate();
    });

    return {
      container,
    };
  },
});
</script>
