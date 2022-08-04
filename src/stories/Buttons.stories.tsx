import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Button, { IButtonProps } from "../components/Buttons/Button"

export default {
    title: "Components/Buttons/Button",
    component: Button
}

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Primary = Template.bind({});
Primary.args = {
    label: 'Button',
    primary: true
}

