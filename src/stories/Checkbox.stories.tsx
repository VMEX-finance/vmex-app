import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Checkbox from "@components/Buttons/Checkbox";

export default {
    title: "Components/Buttons/Checkbox",
    component: Checkbox
} as ComponentMeta<typeof Checkbox>

const Template: ComponentStory<typeof Checkbox> = (args) => <Checkbox {...args } />

export const Primary = Template.bind({})
let checked = false;
Primary.args = {
    checked: checked,
    disabled: false,
    onClick: (e) => {
        checked = !checked
    }

}
