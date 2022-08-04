import React from "react";
import Template from "../templates";
import LandingHero from "../features/heroes/landing.hero"

const Landing: React.FC = () => {
    return (
        <Template classes="h-screen bg-[url('assets/backgrounds/FlowLineAnimate-2.svg')] bg-center bg-cover bg-no-repeat">
            <LandingHero />
        </Template>
    )
}


export default Landing;