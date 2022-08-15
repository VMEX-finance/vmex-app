import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import CoinInput, { ICoinInput } from "../components/inputs/coin-input";

export default {
  title: "Components/Inputs",
  component: CoinInput
}

const Template: ComponentStory<typeof CoinInput> = (args) => <CoinInput {...args} />

export const Coin = Template.bind({});
Coin.args = {
  amount: "0.45",
  balance: "1.45",
  coin: {
    logo: "/tokens/token-BTC.svg",
    name: "BTC"
  }
}