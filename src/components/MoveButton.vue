<template>
  <span
    class="material-icons-round button"
    :class="buttonClass"
    @click="pushButton"
    >open_with</span
  >
</template>

<script lang="ts">
import "material-icons/iconfont/round.css";
import { defineComponent, reactive, watch, computed } from "vue";

interface Button {
  isMove: boolean;
}

export default defineComponent({
  props: {
    isMove: {
      type: Boolean,
      default: false,
    },
  },
  name: "MoveButton",
  setup(props, context) {
    const button = reactive<Button>({
      isMove: props.isMove,
    });
    watch(props, () => {
      button.isMove = props.isMove;
    });
    const buttonClass = computed(() => {
      return button.isMove ? "active" : "";
    });

    const pushButton = () => {
      context.emit("push-movebutton");
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