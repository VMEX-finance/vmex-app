import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Button from "./Button"

export default {
    title: "Components/Buttons",
    component: Button
}

export const Primary: ComponentStory<typeof Button> = () => <Button primary onClick={(e) => {}}>Button</Button>;
export const Secondary: ComponentStory<typeof Button> = () => <Button primary={false} onClick={(e) => {}}>Button</Button>