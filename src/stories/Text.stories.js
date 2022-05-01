import Text from '../components/Text.vue';

export default {
    title: 'Three/Text',
    component: Text,
    argTypes: {
        color: { control: 'color' },
    }
}

const Template = (args) => ({
    components: { Text },
    setup() {
      return { args };
    },
    template: '<Text v-bind="args" />',
});

export const TextSample = Template.bind({});
TextSample.args = {
    color: 'white',
    msg: 'Sample!!'
}

export const TextOwata = Template.bind({});
TextOwata.args = {
    color: 'blue',
    msg: '\\(^q^)/'
}