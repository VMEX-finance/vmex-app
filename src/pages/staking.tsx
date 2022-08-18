import { StakingOverview } from "../features/staking/overview";
import React from "react";
import AppTemplate from "../templates/app-template";
import GridView from "../templates/grid-template";

const Staking: React.FC = () => {
    return (
        <AppTemplate 
            title="staking"
            description={<>
                VMEX users can stake their funds to help secure the protocol, receiving{" "}
                <a className="text-brand-purple underline" href="#">protocol emission</a> in return. Read more about risks associated
                with staking funds <a className="text-brand-purple underline" href="#">here</a>.
            </>}
        >
            <GridView>
                <StakingOverview 
                    safetyFunds={"255.55MM"}
                    dailyEmissions={"200.50 VMEX"}
                    stakers={254}
                    etc={"123"}
                />
            </GridView>
        </AppTemplate>
    )
}
export default Staking;
