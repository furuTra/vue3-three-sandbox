<template>
  <span :class="buttonClass" @click="pushButton"></span>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, computed } from "vue";

interface Button {
  isAdd: boolean;
}

export default defineComponent({
  props: {
    isAdd: {
      type: Boolean,
      default: true,
    },
  },
  name: "AddButton",
  setup(props, context) {
    const button = reactive<Button>({
      isAdd: props.isAdd,
    });
    watch(props, () => {
      button.isAdd = props.isAdd;
    });
    const buttonClass = computed(() => {
      return button.isAdd ? "button add" : "button del";
    });

    const pushButton = () => {
      context.emit("push-addbutton");
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
  top: 90%;
  left: 90%;
  box-shadow: 0 0.2em 0.5em rgba(0, 0, 0, 0.2);
  width: 55px;
  height: 55px;
  background: #ffffff;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  cursor: pointer;
  z-index: 100;
}

.button:after,
.button:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  background: #808080;
  transform: translate(-50%, -50%);
  transition: all 0.25s;
  transition-timing-function: ease-in-out;
}

.button:after {
  height: 2px;
  width: 50%;
}

.button:before {
  height: 50%;
  width: 2px;
}

.button.del:after,
.button.del:before {
  transform: translate(-50%, -50%) rotate(-45deg);
  background: #dc3545;
}
</style>