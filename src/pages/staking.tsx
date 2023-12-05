import React from 'react';
import { GridView } from '@/ui/templates';
import { Base } from '@/ui/base';
import { StakingAsset, StakingOverview } from '@/ui/features';

const Staking: React.FC = () => {
    return (
        <Base
            title="staking"
            description={
                <>
                    VMEX users can stake their funds to help secure the protocol, receiving{' '}
                    <a className="text-brand-purple underline" href="#">
                        protocol emission
                    </a>{' '}
                    in return. Read more about risks associated with staking funds{' '}
                    <a className="text-brand-purple underline" href="#">
                        here
                    </a>
                    .
                </>
            }
        >
            <StakingOverview
                safetyFunds={'255.55MM'}
                dailyEmissions={'200.50 VMEX'}
                stakers={254}
                etc={'123'}
            />
            <GridView>
                <StakingAsset
                    asset={`USDC`}
                    bonus={{
                        days: 275,
                        percent: 9.75,
                    }}
                    apr={`9.75`}
                    slashing={`30`}
                    wallet={{
                        staked: 0.04,
                        claim: 1.59,
                    }}
                    data={{
                        asset: 'USDC',
                        amount: 9921,
                        apy: 0.0078,
                        canBeCollat: true,
                        liquidity: '18.3',
                    }}
                />

                <StakingAsset
                    asset={`USDC`}
                    bonus={{
                        days: 275,
                        percent: 9.75,
                    }}
                    apr={`9.75`}
                    slashing={`30`}
                    wallet={{
                        staked: 0.04,
                        claim: 1.59,
                    }}
                    data={{
                        asset: 'USDC',
                        amount: 9921,
                        apy: 0.0078,
                        canBeCollat: true,
                        liquidity: '18.3',
                    }}
                />
            </GridView>
        </Base>
    );
};
export default Staking;
