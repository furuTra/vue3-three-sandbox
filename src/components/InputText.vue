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
import { defineComponent, reactive, onMounted, ref, h, PropType } from "vue";
import { Bubble } from "../libs/Bubble";

interface Message {
  msg: string;
  color: string;
}

const hoverColor = 0xff0000;

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
    const axes = new THREE.AxesHelper(10);
    const spotLight = new THREE.SpotLight(0xffffff);

    let bubble = new Bubble({
      msg: inputText.msg,
      color: inputText.color,
      rotY: Math.PI / 18,
    });

    let clientWidth, clientHeight;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(1, 1);
    const onPointerMove = (e) => {
      // canvasの縦横長から、canvas内のマウスxy座標を-1~1の範囲で算出
      mouse.x = ((e.offsetX - clientWidth / 2) / clientWidth) * 2;
      mouse.y = ((-e.offsetY + clientHeight / 2) / clientHeight) * 2;
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
        scene.add(axes);

        bubble.createBubble(inputText.color, inputText.msg, bubble.ctx);
        scene.add(bubble.plane);

        renderer.setClearColor(new THREE.Color(0xeeeeee));
        renderer.setSize(clientWidth, clientWidth);
        renderer.setPixelRatio(clientWidth / clientHeight);
        renderer.shadowMap.enabled = true;

        container.value.appendChild(renderer.domElement);
        renderer.domElement.addEventListener("mousemove", onPointerMove);
      }
    };

    let INTERSECTED;
    const objectEmissive = (objs) => {
      // mouseoverしたオブジェクトがMeshであれば、赤く表示する
      if (objs.length > 0 && objs[0].object.type == "Mesh") {
        if (INTERSECTED != objs[0].object) {
          if (INTERSECTED)
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
          INTERSECTED = objs[0].object;
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
          INTERSECTED.material.emissive.setHex(hoverColor);
        }
      } else {
        if (INTERSECTED)
          INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
      }
    };

    const animate = () => {
      const frame = () => {
        bubble.createBubble(inputText.color, inputText.msg, bubble.ctx);
        bubble.plane.material.map.needsUpdate = true;

        controls.update();
        renderer.render(scene, camera);
        raycaster.setFromCamera(mouse, camera);
        // mousehover位置にあるオブジェクトを取得
        let objs = raycaster.intersectObjects(scene.children);
        requestAnimationFrame(frame);
        objectEmissive(objs);
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