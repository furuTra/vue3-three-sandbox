<template>
  <div>
    <input type="text" placeholder="edit here" v-model="inputText.msg" />
    <input type="text" placeholder="edit here" v-model="inputText.color" />
  </div>
  <div ref="container" style="width: 589px; height: 589px"></div>
</template>

<script lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { defineComponent, reactive, onMounted, ref, h } from "vue";

interface Message {
  msg: String
  color: String
}

export default defineComponent({
  props: {
    color: {
      type: String,
      default: "pink",
    },
    msg: {
      type: String,
      default: "hello",
    },
  },
  setup(props) {
    const inputText = reactive<Message>({
      msg: props.msg,
      color: props.color
    })

    const container = ref(null);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    const grid = new THREE.GridHelper();
    const axes = new THREE.AxesHelper(10);
    const spotLight = new THREE.SpotLight(0xffffff);
    let planeMesh;

    const ctx = document.createElement("canvas").getContext("2d");

    const drawBubble = (color) => {
      ctx.canvas.width = 256;
      ctx.canvas.height = 256;
      ctx.clearRect(0, 0, 256, 256);
      ctx.beginPath();
      ctx.moveTo(75 * 2, 25);
      // 吹き出し左上
      ctx.quadraticCurveTo(25, 25, 25, 62.5 * 2);
      // 吹き出し左下
      ctx.quadraticCurveTo(25, 100 * 2, 50 * 2, 100 * 2);
      // 吹き出し下
      ctx.quadraticCurveTo(50 * 2, 120 * 2, 30 * 2, 125 * 2);
      ctx.quadraticCurveTo(60 * 2, 120 * 2, 65 * 2, 100 * 2);
      // 吹き出し右下
      ctx.quadraticCurveTo(125 * 2, 100 * 2, 125 * 2, 62.5 * 2);
      // 吹き出し右上
      ctx.quadraticCurveTo(125 * 2, 25, 75 * 2, 25);
      ctx.fillStyle = color;
      ctx.fill();
    };

    const drawMsg = (msg) => {
      ctx.fillStyle = "black";
      ctx.font = "30px 'Arial'";
      ctx.fillText(msg, ctx.canvas.width / 2, ctx.canvas.height / 2);
    };

    const init = () => {
      if (container.value instanceof HTMLElement) {
        spotLight.position.set(7, 5, 5);

        const { clientWidth, clientHeight } = container.value;
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        camera.position.set(0, 10, 10);
        camera.lookAt(0, 0, 0);

        scene.add(spotLight);
        scene.add(grid);
        scene.add(axes);

        drawBubble(inputText.color);
        drawMsg(inputText.msg);

        const planeGeometry = new THREE.PlaneGeometry(5, 5);
        const planeTexture = new THREE.CanvasTexture(ctx.canvas);
        const planeMaterial = new THREE.MeshBasicMaterial({
          map: planeTexture,
          transparent: true,
          side: THREE.DoubleSide,
        });
        planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        scene.add(planeMesh);

        renderer.setClearColor(new THREE.Color(0xeeeeee));
        renderer.setSize(clientWidth, clientWidth);
        renderer.setPixelRatio(clientWidth / clientHeight);
        renderer.shadowMap.enabled = true;

        container.value.appendChild(renderer.domElement);
      }
    };

    const animate = () => {
      const frame = () => {
        drawBubble(inputText.color);
        drawMsg(inputText.msg);
        planeMesh.material.map.needsUpdate = true;
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
      inputText,
      container,
    };
  },
});
</script>
