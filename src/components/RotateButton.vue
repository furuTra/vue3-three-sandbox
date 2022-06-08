<template>
  <span
    class="material-icons-round button"
    :class="buttonClass"
    @click="pushButton"
    >3d_rotation</span
  >
</template>

<script lang="ts">
import "material-icons/iconfont/round.css";
import { defineComponent, reactive, watch, computed } from "vue";

interface Button {
  isRotate: boolean;
}

export default defineComponent({
  props: {
    isRotate: {
      type: Boolean,
      default: false,
    },
  },
  name: "RotateButton",
  setup(props, context) {
    const button = reactive<Button>({
      isRotate: props.isRotate,
    });
    watch(props, () => {
      button.isRotate = props.isRotate;
    });
    const buttonClass = computed(() => {
      return button.isRotate ? "active" : "";
    });

    const pushButton = () => {
      context.emit("push-rotatebutton");
    };

    return {
      buttonClass,
      pushButton,
      button,
    };
  },
});
</script>

<style scoped>
.button {
  position: absolute;
  box-shadow: 0 0.2em 0.5em rgba(0, 0, 0, 0.2);
  color: #808080;
  background: #ffffff;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  cursor: pointer;
  z-index: 100;
  padding: 10px;
}

.active {
  color: #0d6efd;
}
</style>