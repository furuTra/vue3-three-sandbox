<template>
  <div class="container">
    <div ref="container" id="canvas"></div>
    <InputMessage
      class="Message"
      :color="inputText.color"
      :msg="inputText.msg"
      @input-msg="inputMsg"
      @input-color="inputColor"
    />
    <AddButton
      class="AddButton"
      :isAdd="button.isAdd"
      @push-addbutton="pushAddButton"
    />
    <RotateButton
      class="RotateButton"
      :isRotate="button.isRotate"
      @push-rotatebutton="pushRotateButton"
    />
    <MoveButton
      class="MoveButton"
      :isMove="button.isMove"
      @push-movebutton="pushMoveButton"
    />
  </div>
</template>

<script lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  defineComponent,
  reactive,
  onMounted,
  ref,
  PropType,
} from "vue";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { Bubble, IBubble } from "../libs/Bubble";
import InputMessage from "./InputMessage.vue";
import AddButton from "./AddButton.vue";
import RotateButton from "./RotateButton.vue";
import MoveButton from "./MoveButton.vue";

interface Message {
  msg: string;
  color: string;
}

interface Button {
  isAdd: boolean;
  isMove: boolean;
  isRotate: boolean;
}

const hoverColor = 0xff0000;

export default defineComponent({
  name: "InputText",
  components: {
    InputMessage,
    AddButton,
    RotateButton,
    MoveButton,
  },
  props: {
    bubbles: {
      type: Array as PropType<IBubble[]>,
      default: () => [
        new Bubble({
          msg: "hello!!",
          color: "pink",
          rotY: Math.PI / 18,
        }),
        new Bubble({
          msg: "sample!!",
          color: "skyblue",
          posX: 5,
          posY: 0,
          posZ: 2,
        }),
        new Bubble({
          msg: "What!!",
          color: "green",
          posX: 5,
          posY: 5,
          posZ: 0,
        }),
      ],
    },
  },
  setup(props) {
    const inputText = reactive<Message>({
      msg: "",
      color: "#" + new THREE.Color("white").getHexString(),
    });
    const button = reactive<Button>({
      isAdd: true,
      isMove: false,
      isRotate: false,
    });
    // HACK: reactiveなオブジェクトとして吹き出しを作成すると、ArrayではなくProxyとなってしまい、sceneに追加できない
    let bubbles = props.bubbles;

    const container = ref(null);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    const tfcontrols = new TransformControls(camera, renderer.domElement);
    const axes = new THREE.AxesHelper(10);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    let clientWidth, clientHeight;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector3(0, 0, 0);
    const onPointerMove = (e) => {
      // canvasの縦横長から、canvas内のマウスxy座標を-1~1の範囲で算出
      mouse.x = ((e.offsetX - clientWidth / 2) / clientWidth) * 2;
      mouse.y = ((-e.offsetY + clientHeight / 2) / clientHeight) * 2;
    };

    let selectBubble;
    const onPointerDown = () => {
      if (INTERSECTED) {
        button.isAdd = false;
        selectBubble = bubbles.find(
          (bubble) => bubble.uuid == INTERSECTED.uuid
        );
        inputText.msg = selectBubble.msg;
        inputText.color =
          "#" + new THREE.Color(selectBubble.color).getHexString();
      } else {
        button.isAdd = true;
      }
    };

    const inputMsg = (msg: string) => {
      inputText.msg = msg;
    };

    const inputColor = (color: string) => {
      inputText.color = color;
    };

    const pushAddButton = () => {
      button.isAdd ? addBubble() : removeBubble();
    };

    const addTFControls = (mesh: THREE.Object3D) => {
      if (mesh !== tfcontrols.object) {
        tfcontrols.attach(mesh);
      }
    };

    const pushMoveButton = () => {
      button.isMove = !button.isMove;
      button.isRotate = false;
      if (button.isMove) {
        tfcontrols.setMode("translate");
        if (selectBubble) {
          addTFControls(selectBubble.plane);
        }
      } else {
        tfcontrols.detach();
      }
    };

    const pushRotateButton = () => {
      button.isRotate = !button.isRotate;
      button.isMove = false;
      if (button.isRotate) {
        tfcontrols.setMode("rotate");
        if (selectBubble) {
          addTFControls(selectBubble.plane);
        }
      } else {
        tfcontrols.detach();
      }
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

    const removeBubble = () => {
      bubbles.splice(bubbles.indexOf(selectBubble), 1);
      tfcontrols.detach();
      scene.remove(selectBubble.plane);
      button.isAdd = true;
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
        // TODO: 画面サイズに合わせて表示できるようにしたい
        clientWidth = container.value.clientWidth;
        clientHeight = container.value.clientHeight;
        // clientWidth = window.innerWidth;
        // clientHeight = window.innerHeight;

        camera.aspect = clientWidth / clientHeight;
        camera.fov = 90;
        camera.near = 3;
        camera.updateProjectionMatrix();
        camera.position.set(0, 10, 10);

        scene.add(ambientLight);
        scene.add(axes);

        bubbles.forEach((bubble) => {
          bubble.createBubble(bubble.color, bubble.msg, bubble.ctx);
          scene.add(bubble.plane);
        });

        controls.update();
        controls.addEventListener("change", render);

        tfcontrols.addEventListener("change", render);
        // NOTE: オブジェクト操作時にOrbitControls操作が起動しないように設定
        tfcontrols.addEventListener("dragging-changed", (e) => {
          controls.enabled = !e.value;
        });
        scene.add(tfcontrols);

        renderer.setClearColor(new THREE.Color(0xeeeeee));
        renderer.setSize(clientWidth, clientWidth);
        renderer.setPixelRatio(clientWidth / clientHeight);
        renderer.shadowMap.enabled = true;

        container.value.appendChild(renderer.domElement);
        renderer.domElement.addEventListener("mousemove", onPointerMove);
        renderer.domElement.addEventListener("mousedown", onPointerDown);
      }
    };

    const isBubble = (object: THREE.Object3D) => {
      // NOTE: TransformControlsで表示されるオブジェクトもMeshなため、nameも判定条件に含める
      return object.type == "Mesh" && object.name == "bubble";
    };

    let INTERSECTED;
    const objectEmissive = () => {
      // mousehover位置にあるオブジェクトを取得
      raycaster.setFromCamera(mouse, camera);
      let objs = raycaster.intersectObjects(scene.children);
      // mouseoverしたオブジェクトが吹き出しであれば、赤く表示する
      if (objs.length > 0 && isBubble(objs[0].object)) {
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

    const render = () => {
      renderer.render(scene, camera);
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

        render();
        requestAnimationFrame(frame);
        objectEmissive();
      };
      frame();
    };

    onMounted(() => {
      init();
      animate();
    });

    return {
      inputText,
      inputMsg,
      inputColor,
      pushAddButton,
      pushMoveButton,
      pushRotateButton,
      button,
      container,
    };
  },
});
</script>

<style scoped>
.container {
  position: relative;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: auto;
  width: 589px;
  height: 589px;
}
#canvas {
  width: 100%;
  height: 100%;
}
.Message {
  top: 90%;
  left: 30%;
}
.AddButton {
  top: 90%;
  left: 90%;
}
.RotateButton {
  top: 75%;
  left: 90%;
}
.MoveButton {
  top: 60%;
  left: 90%;
}
</style>