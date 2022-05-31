<template>
  <div class="InputMsg">
    <input
      type="color"
      name="color"
      placeholder="edit here"
      v-model="inputText.color"
      @change="inputColor"
    />
    <input
      type="text"
      name="msg"
      placeholder="message here..."
      v-model="inputText.msg"
      @change="inputMsg"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";

interface Message {
  msg: string;
  color: string;
}

export default defineComponent({
  props: {
    color: {
      type: String,
      default: "#ffffff",
    },
    msg: {
      type: String,
      default: "",
    },
  },
  name: "InputMessage",
  setup(props, context) {
    const inputText = reactive<Message>({
      msg: props.msg,
      color: props.color,
    });
    watch(props, () => {
      inputText.color = props.color;
      inputText.msg = props.msg;
    });

    const inputMsg = (e) => {
      context.emit("input-msg", e.target.value);
    };

    const inputColor = (e) => {
      context.emit("input-color", e.target.value);
    };

    return {
      inputText,
      inputMsg,
      inputColor,
    };
  },
});
</script>

<style scoped>
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