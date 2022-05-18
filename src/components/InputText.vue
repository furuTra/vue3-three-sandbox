<template>
  <div>
    <p>
      <label for="text">吹き出しのメッセージ：</label>
      <input type="text" placeholder="edit here" v-model="inputText.msg" />
    </p>
    <p>
      <label for="color">吹き出しの色：</label>
      <input type="color" placeholder="edit here" v-model="inputText.color" />
    </p>
  </div>
  <!-- <div ref="container" class="container"></div> -->
  <div ref="container" style="width: 589px; height: 589px"></div>
</template>

<script lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { defineComponent, reactive, onMounted, ref, h } from "vue";

interface Message {
  msg: String;
  color: String;
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
      color: "#" + new THREE.Color(props.color).getHexString(),
    });

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

    let clientWidth, clientHeight, mouseX, mouseY;
    let objs = [];
    let INTERSECTED;
    const mouseOver = () => {
      renderer.domElement.addEventListener("mousemove", (e) => {
        // canvasの縦横長から、canvas内のマウスxy座標を-1~1の範囲で算出
        mouseX = ((e.offsetX - clientWidth / 2) / clientWidth) * 2;
        mouseY = ((-e.offsetY + clientHeight / 2) / clientHeight) * 2;
        var pos = new THREE.Vector3(mouseX, mouseY, 1);
        pos.unproject(camera);
        var ray = new THREE.Raycaster(
          camera.position,
          pos.sub(camera.position).normalize()
        );
        // mousehover位置にあるオブジェクトを取得
        objs = ray.intersectObjects(scene.children);
      });
    };

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
      // 吹き出し右下
      ctx.quadraticCurveTo(125 * 2, 100 * 2, 125 * 2, 62.5 * 2);
      // 吹き出し右上
      ctx.quadraticCurveTo(125 * 2, 25, 75 * 2, 25);
      // 吹き出し下
      ctx.quadraticCurveTo(50 * 2, 120 * 2, 30 * 2, 125 * 2);
      ctx.quadraticCurveTo(60 * 2, 120 * 2, 65 * 2, 100 * 2);
      ctx.fillStyle = color;
      ctx.fill();
    };

    const drawMsg = (msg) => {
      ctx.fillStyle = "black";
      ctx.font = "20px 'Arial'";
      ctx.textAlign = "center";
      ctx.fillText(msg, ctx.canvas.width / 2, ctx.canvas.height / 2);
    };

    const init = () => {
      if (container.value instanceof HTMLElement) {
        spotLight.position.set(7, 5, 5);

        clientWidth = container.value.clientWidth;
        clientHeight = container.value.clientHeight;

        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        camera.position.set(0, 10, 10);
        camera.lookAt(0, 0, 0);

        scene.add(spotLight);
        scene.add(grid);
        scene.add(axes);

        mouseOver();
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

        // mouseoverしたオブジェクトがMeshであれば、回転表示する
        if (objs.length > 0 && objs[0].object.type == "Mesh") {
          if (INTERSECTED != objs[0].object) {
            INTERSECTED = objs[0].object;
          }
          INTERSECTED.rotation.y += 0.02;
        }
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

<style scoped>
.container {
  width: 80%;
  height: 80%;
}
</style>