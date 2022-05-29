<template>
  <span class="AddButton" @click="pushButton"></span>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

interface Button {
  isAdd: boolean;
}

export default defineComponent({
  props: {
    isAdd: {
      type: Boolean,
      default: false,
    },
  },
  name: "AddButton",
  setup(props, context) {
    const button = reactive<Button>({
      isAdd: props.isAdd,
    });

    const pushButton = () => {
      context.emit('push-addbutton')
    };

    return {
      pushButton,
      button,
    };
  },
});
</script>

<style scoped>
.AddButton {
  box-shadow: 0 0.2em 0.5em rgba(0, 0, 0, 0.2);
  width: 55px;
  height: 55px;
  background: #ffffff;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  cursor: pointer;
  z-index: 100;
}

.AddButton:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 2px;
  width: 50%;
  background: #808080;
}

.AddButton:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 50%;
  width: 2px;
  background: #808080;
}
</style>