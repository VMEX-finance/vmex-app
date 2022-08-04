import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import DropdownButton, { DropdownItem, IDropdown } from "@components/Buttons/Dropdown";

export default {
    title: "Components/Buttons/Dropdown",
    component: DropdownButton
} as ComponentMeta<typeof DropdownButton>

const Template: ComponentStory<typeof DropdownButton> = (args) => <DropdownButton {...args } />

export const Primary = Template.bind({})
Primary.args = {
    label: "All Tranches",
    menuItems: [
        <DropdownItem label="Example 1" />,
        <DropdownItem label="Example 2" />
    ]
}
