import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { IDropdown, DropdownButton } from '@ui/components/buttons';

export default {
    title: 'Components/Buttons',
    component: DropdownButton,
} as ComponentMeta<typeof DropdownButton>;

const Template: ComponentStory<typeof DropdownButton> = (args) => <DropdownButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    items: [
        {
            text: 'Example 1',
        },
        {
            text: 'Example 2',
        },
    ],
};
