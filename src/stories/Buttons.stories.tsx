import React from 'react';
import { ComponentStory } from '@storybook/react';
import { IButtonProps, Button } from '@ui/components/buttons';

export default {
    title: 'Components/Buttons/Button',
    component: Button,
};

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    label: 'Button',
    primary: true,
};
