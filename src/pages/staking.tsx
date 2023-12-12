import React from 'react';
import { GridView } from '@/ui/templates';
import { Base } from '@/ui/base';
import { StakingAsset, StakingOverview } from '@/ui/features';
import { numberFormatter, percentFormatter } from '@/utils';
import { Card, CustomTabPanel, CustomTabs } from '@/ui/components';

const Staking: React.FC = () => {
    const [tabIndex, setTabIndex] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

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
                apr={percentFormatter.format(0)}
                totalLocked={numberFormatter.format(0)}
                yourLocked={numberFormatter.format(0)}
                expiration={'-'}
            />

            <Card>
                <CustomTabs
                    id="staking"
                    tabs={['Manage Gauges', 'Manage veVMEX', 'Claim / Redeem']}
                    tabIndex={tabIndex}
                    handleTabChange={handleTabChange}
                />
                <CustomTabPanel value={tabIndex} index={0}>
                    Item One
                </CustomTabPanel>
                <CustomTabPanel value={tabIndex} index={1}>
                    Item Two
                </CustomTabPanel>
                <CustomTabPanel value={tabIndex} index={2}>
                    Item Three
                </CustomTabPanel>
            </Card>
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
