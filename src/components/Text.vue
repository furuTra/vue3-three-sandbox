<template>
  <div ref="container" style="width: 589px; height: 589px"></div>
</template>

<script lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  props: {
    color: {
      type: String,
      default: "#2e8b57",
    },
    msg: {
      type: String,
      default: "hello",
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

    const textMaterial = new THREE.MeshPhongMaterial({
      color: props.color,
      flatShading: true,
    });

    let font = undefined;
    const fontLoader = new FontLoader();
    const textGroup = new THREE.Group();

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(7, 5, 5);

    const init = () => {
      if (container.value instanceof HTMLElement) {
        const { clientWidth, clientHeight } = container.value;

        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        camera.position.set(0, 10, 10);
        camera.lookAt(new THREE.Vector3(0, 0, -5));

        scene.add(spotLight);
        scene.add(grid);
        scene.add(axes);

        renderer.setClearColor(new THREE.Color(0xeeeeee));
        renderer.setSize(clientWidth, clientWidth);
        renderer.setPixelRatio(clientWidth / clientHeight);
        renderer.shadowMap.enabled = true;

        scene.add(textGroup);

        loadFont();

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

    const loadFont = () => {
      fontLoader.load("/fonts/helvetiker_regular.typeface.json", (response) => {
        font = response;
        createText();
      });
    };

    const createText = () => {
      const textGeo = new TextGeometry(props.msg, {
        font: font,
        size: 4,
        height: 0,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.08,
        bevelOffset: 0,
        bevelSegments: 10,
      });
      textGeo.computeBoundingBox();
      const centerOffset =
        -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
      const textMesh = new THREE.Mesh(textGeo, textMaterial);
      textMesh.position.set(centerOffset, 0, -5);
      textGroup.add(textMesh);
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
