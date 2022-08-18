import { StakingOverview } from "../features/staking/StakeOverview";
import React from "react";
import AppTemplate from "../templates/app-template";
import GridView from "../templates/grid-template";
import { StakingAsset } from "../features/staking/StakeAsset";

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
                <StakingOverview 
                    safetyFunds={"255.55MM"}
                    dailyEmissions={"200.50 VMEX"}
                    stakers={254}
                    etc={"123"}
                />
            <GridView>
                <StakingAsset 
                    asset={`USDC`}
                    bonus={{
                        days: 275,
                        percent: 9.75
                    }}
                    apr={`9.75`}
                    slashing={`30`}
                    wallet={{
                        staked: 0.04,
                        claim: 1.59
                    }}
                />

                <StakingAsset 
                    asset={`USDC`}
                    bonus={{
                        days: 275,
                        percent: 9.75
                    }}
                    apr={`9.75`}
                    slashing={`30`}
                    wallet={{
                        staked: 0.04,
                        claim: 1.59
                    }}
                />
            </GridView>
        </AppTemplate>
    )
}
export default Staking;
