import AddButton from "../components/AddButton.vue"

export default {
    title: 'Component/AddButton',
    component: AddButton,
    argTypes: {
        isAdd: { control: 'boolean' },
    }
}

const Template = (args) => ({
    components: { AddButton },
    setup() {
      return { args };
    },
    template: '<AddButton v-bind="args" />',
});

export const Button = Template.bind({});
Button.args = {
    isAdd: true,
}
