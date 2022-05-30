<template>
  <div class="container">
    <div ref="container" id="canvas"></div>
    <div class="InputMsg" id="inputMessage">
      <input type="color" placeholder="edit here" v-model="inputText.color" />
      <input
        type="text"
        placeholder="message here..."
        v-model="inputText.msg"
      />
    </div>
    <!-- <InputMessage
      id="inputMessage"
      :color="inputText.color"
      :msg="inputText.msg"
      @input="handleInput"
    /> -->
    <AddButton id="button" @push-addbutton="pushButton" />
  </div>
</template>

<script lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { defineComponent, reactive, onMounted, ref, computed } from "vue";
import { Bubble } from "../libs/Bubble";
// import InputMessage from "./InputMessage.vue";
import AddButton from "./AddButton.vue";

interface Message {
  msg: string;
  color: string;
}

interface Button {
  isAdd: boolean;
}

const hoverColor = 0xff0000;

export default defineComponent({
  name: "InputText",
  components: {
    // InputMessage,
    AddButton,
  },
  setup() {
    const inputText = reactive<Message>({
      msg: "",
      color: "#" + new THREE.Color("white").getHexString(),
    });
    const button = reactive<Button>({
      isAdd: false,
    });

    const container = ref(null);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    const axes = new THREE.AxesHelper(10);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    let bubbles = [
      new Bubble({
        msg: "hello!!",
        color: "pink",
        rotY: Math.PI / 18,
      }),
      new Bubble({
        msg: "sample!!",
        color: "skyblue",
        posX: 4,
        posY: 1,
        posZ: 1,
      }),
      new Bubble({
        msg: "What!!",
        color: "green",
        posX: 2,
        posY: 5,
        posZ: 0,
      }),
    ];

    let clientWidth, clientHeight;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onPointerMove = (e) => {
      // canvasの縦横長から、canvas内のマウスxy座標を-1~1の範囲で算出
      mouse.x = ((e.offsetX - clientWidth / 2) / clientWidth) * 2;
      mouse.y = ((-e.offsetY + clientHeight / 2) / clientHeight) * 2;
    };

    let selectBubble;
    const onPointerDown = (e) => {
      if (INTERSECTED) {
        selectBubble = bubbles.find(
          (bubble) => bubble.uuid == INTERSECTED.uuid
        );
        inputText.msg = selectBubble.msg;
        inputText.color =
          "#" + new THREE.Color(selectBubble.color).getHexString();
      }
    };

    const pushButton = () => {
      button.isAdd = !button.isAdd;
      addBubble();
    };

    const addBubble = () => {
      let point = getWorldPoint();
      let bubble = new Bubble({
        msg: "",
        color: "white",
        posX: point.x,
        posY: point.y,
        posZ: point.z,
      });
      bubble.createBubble(bubble.color, bubble.msg, bubble.ctx);
      bubbles.push(bubble);
      scene.add(bubble.plane);
    };

    const getWorldPoint = () => {
      let worldPoint = new THREE.Vector3();
      worldPoint.x = mouse.x - 1;
      worldPoint.y = mouse.y + 1;
      worldPoint.z = 0;
      worldPoint.unproject(camera);
      return worldPoint;
    };

    const init = () => {
      if (container.value instanceof HTMLElement) {
        clientWidth = container.value.clientWidth;
        clientHeight = container.value.clientHeight;
        // clientWidth = window.innerWidth;
        // clientHeight = window.innerHeight;

        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        camera.position.set(0, 10, 10);
        camera.lookAt(0, 0, 0);

        scene.add(ambientLight);
        scene.add(axes);

        bubbles.forEach((bubble) => {
          bubble.createBubble(bubble.color, bubble.msg, bubble.ctx);
          scene.add(bubble.plane);
        });

        renderer.setClearColor(new THREE.Color(0xeeeeee));
        renderer.setSize(clientWidth, clientWidth);
        renderer.setPixelRatio(clientWidth / clientHeight);
        renderer.shadowMap.enabled = true;

        container.value.appendChild(renderer.domElement);
        renderer.domElement.addEventListener("mousemove", onPointerMove);
        renderer.domElement.addEventListener("mousedown", onPointerDown);
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
        if (selectBubble) {
          selectBubble.createBubble(
            inputText.color,
            inputText.msg,
            selectBubble.ctx
          );
          selectBubble.color = inputText.color;
          selectBubble.msg = inputText.msg;
          selectBubble.plane.material.map.needsUpdate = true;
        }

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
      pushButton,
      button,
      container,
    };
  },
});
</script>

<style scoped>
.container {
  position: relative;
  margin-left: auto;
  margin-right: auto;
  width: 589px;
  height: 589px;
}
#canvas {
  width: 100%;
  height: 100%;
}
#button {
  position: absolute;
  top: 90%;
  left: 90%;
}
#inputMessage {
  position: absolute;
  top: 90%;
  left: 30%;
}

.InputMsg {
  box-shadow: 0 0.2em 0.5em rgba(0, 0, 0, 0.2);
  background: #ffffff;
  height: 55px;
  z-index: 100;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  display: inline-flex;
  vertical-align: middle;
}
.InputMsg input[type="text"] {
  font-size: 100%;
  border: none;
  outline: none;
  box-sizing: content-box;
  background-color: transparent;
  background-clip: padding-box;
  font-family: Arial, Helvetica, sans-serif;
  cursor: pointer;
}
.InputMsg input[type="color"] {
  margin-left: 5%;
  border: none;
  background: none;
  height: 100%;
  cursor: pointer;
}
</style>