import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Navbar from "./Navbar";

export default {
    title: "Components/Navbars",
    component: Navbar
} as ComponentMeta<typeof Navbar>

const Template: ComponentStory<typeof Navbar> = (args) => <Navbar {...args}></Navbar>

export const Primary = Template.bind({})

Primary.args = {
    pages: ["Lending", "Borrowing", "Staking", "Markets", "Governance", "Develop"]
}