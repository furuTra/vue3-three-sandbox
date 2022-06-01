import InputMessage from "../components/InputMessage.vue"

export default {
    title: 'Component/InputMessage',
    component: InputMessage,
    argTypes: {
        color: { control: 'color' },
    }
}

const Template = (args) => ({
    components: { InputMessage },
    setup() {
      return { args };
    },
    template: '<InputMessage v-bind="args" />',
});

export const InputMessage1 = Template.bind({});
InputMessage1.args = {
    color: '#ffffff',
    msg: 'Sample'
}

export const InputMessage2 = Template.bind({});
InputMessage2.args = {
    color: '#8dd9f7',
    msg: '空色'
}
