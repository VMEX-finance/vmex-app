import React from 'react';
import { GridView } from '@/ui/templates';
import { Base } from '@/ui/base';
import { StakingAsset, StakingOverview } from '@/ui/features';
import { numberFormatter, percentFormatter } from '@/utils';
import { Card, CustomTabPanel, CustomTabs } from '@/ui/components';
import { GaugesTable } from '@/ui/tables';
import { useNavigate, createSearchParams } from 'react-router-dom';

const Staking: React.FC = () => {
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        const tabText = (event.target as any).innerText;
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
                    <GaugesTable data={[]} loading={false} />
                </CustomTabPanel>
                <CustomTabPanel value={tabIndex} index={1}>
                    <div className="flex flex-col divide-y divide-gray-300 dark:divide-gray-700">
                        <GridView className="p-2" type="fixed" cols="grid-cols-1 lg:grid-cols-2">
                            <div>
                                <h3 className="text-xl mb-3">
                                    VMEX Holders, lock your tokens here.
                                </h3>
                                <p>Lock your VMEX to veVMEX to:</p>
                                <ol className="list-disc pl-6">
                                    <li>Take part in VMEX governance.</li>
                                    <li>Direct VMEX rewards to vaults.</li>
                                    <li>Receive dVMEX (the longer you lock, the more you keep).</li>
                                </ol>
                            </div>
                            <div></div>
                        </GridView>
                        <GridView className="p-2" type="fixed" cols="grid-cols-1 lg:grid-cols-2">
                            <div>
                                <h3 className="text-xl mb-3">Extend lock</h3>
                                <p>
                                    Want to lock for longer? Extend your lock period to increase
                                    your gauge boost weight.
                                </p>
                            </div>
                            <div></div>
                        </GridView>
                        <GridView className="p-2" type="fixed" cols="grid-cols-1 lg:grid-cols-2">
                            <div>
                                <h3 className="text-xl mb-3">Early exit</h3>
                                <p>
                                    Or you can exit early by paying a penalty based on lock
                                    duration.
                                </p>
                            </div>
                            <div></div>
                        </GridView>
                        <GridView className="p-2" type="fixed" cols="grid-cols-1 lg:grid-cols-2">
                            <div>
                                <h3 className="text-xl mb-3">Claim expired lock</h3>
                                <p>Claim your YFI from expired veYFI lock.</p>
                            </div>
                            <div></div>
                        </GridView>
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={tabIndex} index={2}>
                    <GridView>
                        <StakingAsset
                            title="Claim"
                            asset={`veVMEX`}
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
                            title="Redeem"
                            asset={`dVMEX`}
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
                </CustomTabPanel>
            </Card>
        </Base>
    );
};
export default Staking;
