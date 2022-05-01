import Cube from '../components/Cube.vue';

export default {
    title: 'Three/Cube',
    component: Cube,
    argTypes: {
        color: { control: 'color' },
    }
}

const Template = (args) => ({
    components: { Cube },
    setup() {
      return { args };
    },
    template: '<cube v-bind="args" />',
});

export const CubeBox = Template.bind({});
CubeBox.args = {
    color: 'white',
}