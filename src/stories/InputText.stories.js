import InputText from "../components/InputText.vue"

export default {
    title: 'Three/InputText',
    component: InputText,
}

const Template = (args) => ({
    components: { InputText },
    setup() {
      return { args };
    },
    template: '<InputText v-bind="args" />',
});

export const TextSample1 = Template.bind({});