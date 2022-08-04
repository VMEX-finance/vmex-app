import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Navbar, { MenuItem } from "@components/Navigation/Navbar";

export default {
    title: "Components/Navbars",
    component: Navbar,
    subcomponents: {
        MenuItem
    }
} as ComponentMeta<typeof Navbar>

const Template: ComponentStory<typeof Navbar> = (args) => <Navbar {...args}></Navbar>

export const Primary = Template.bind({})
Primary.args = {
    children: [
        <MenuItem label="Lending" selected/>,
        <MenuItem label="Borrowing"/>,
        <MenuItem label="Staking" />,
        <MenuItem label="Markets" />,
        <MenuItem label="Governance" />,
        <MenuItem label="Develop" />
    ]
}