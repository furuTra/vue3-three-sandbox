import InputText from "../components/InputText.vue"

export default {
    title: 'Three/InputText',
    component: InputText,
    argTypes: {
        color: { control: 'color' },
    }
}

const Template = (args) => ({
    components: { InputText },
    setup() {
      return { args };
    },
    template: '<InputText v-bind="args" />',
});

export const TextSample1 = Template.bind({});
TextSample1.args = {
    color: 'white',
    msg: 'Sample'
}

export const TextSample2 = Template.bind({});
TextSample2.args = {
    color: 'skyblue',
    msg: '空色'
}