import React from 'react';
import { GridView } from '@/ui/templates';
import { Base } from '@/ui/base';
import { StakingAsset, StakingOverview } from '@/ui/features';
import { numberFormatter, percentFormatter } from '@/utils';
import { Button, Card, CustomTabPanel, CustomTabs, StakeInput } from '@/ui/components';
import { GaugesTable } from '@/ui/tables';
import { useWindowSize } from '@/hooks';
import { constants, utils } from 'ethers';

const Staking: React.FC = () => {
    const { width, breakpoints } = useWindowSize();
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
                    tabs={
                        width > breakpoints.sm
                            ? ['Manage Gauges', 'Manage veVMEX', 'Claim Rewards', 'Redeem dVMEX']
                            : ['Gauges', 'veVMEX', 'Rewards', 'Redeem']
                    }
                    tabIndex={tabIndex}
                    handleTabChange={handleTabChange}
                />
                <CustomTabPanel value={tabIndex} index={0}>
                    <GaugesTable
                        data={[
                            {
                                asset: 'Curve VMEX-ETH Pool vVault',
                                assetAddress: constants.AddressZero,
                                tranche: 'Tranche 0',
                                trancheId: '0',
                                vaultApy: '3.52',
                                depositedInVault: '0',
                                gaugeAprMin: '0.51',
                                gaugeAprMax: '5.81',
                                stakedInGauge: '0',
                                boost: 'N/A',
                            },
                        ]}
                        loading={false}
                    />
                </CustomTabPanel>
                <CustomTabPanel value={tabIndex} index={1}>
                    <div className="flex flex-col divide-y divide-gray-300 dark:divide-gray-700">
                        <GridView
                            className="p-2 pt-1"
                            type="fixed"
                            cols="grid-cols-1 lg:grid-cols-2"
                        >
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
                            <div className="grid sm:grid-cols-2 gap-1 lg:gap-2 xl:gap-2.5 content-end items-end">
                                <StakeInput
                                    header="VMEX"
                                    footer={`Available: ${numberFormatter.format(0)} VMEX`}
                                    onChange={() => {}}
                                    value=""
                                    max="0"
                                />
                                <StakeInput
                                    header="Current lock period (weeks)"
                                    footer="Minimum: 1 week"
                                    onChange={() => {}}
                                    value=""
                                    max="0"
                                />
                                <StakeInput header="Total veVMEX" value="" disabled />
                                <Button type="accent" className="h-fit mb-[17.88px]">
                                    Approve
                                </Button>
                            </div>
                        </GridView>
                        <GridView
                            className="p-2 lg:pt-4"
                            type="fixed"
                            cols="grid-cols-1 lg:grid-cols-2"
                        >
                            <div>
                                <h3 className="text-xl mb-3">Extend lock</h3>
                                <p>
                                    Want to lock for longer? Extend your lock period to increase
                                    your gauge boost weight.
                                </p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-1 lg:gap-2 content-end items-end">
                                <StakeInput
                                    header="Current lock period (weeks)"
                                    onChange={() => {}}
                                    value=""
                                />
                                <StakeInput
                                    header="Increase lock period (weeks)"
                                    footer="Minimum: 1 week"
                                    onChange={() => {}}
                                    value=""
                                />
                                <StakeInput header="Total veVMEX" onChange={() => {}} value="" />
                                <Button type="accent" className="h-fit mb-[17.88px]">
                                    Extend
                                </Button>
                            </div>
                        </GridView>
                        <GridView
                            className="p-2 lg:pt-4"
                            type="fixed"
                            cols="grid-cols-1 lg:grid-cols-2"
                        >
                            <div>
                                <h3 className="text-xl mb-3">Early exit</h3>
                                <p>
                                    Or you can exit early by paying a penalty based on lock
                                    duration.
                                </p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-1 lg:gap-2 content-end items-end">
                                <StakeInput header="veVMEX you have" onChange={() => {}} value="" />
                                <StakeInput
                                    header="Current lock time (weeks)"
                                    onChange={() => {}}
                                    value=""
                                />
                                <StakeInput
                                    header="VMEX you get"
                                    footer={`Penalty: ${percentFormatter.format(0)}`}
                                    onChange={() => {}}
                                    value=""
                                />
                                <Button type="accent" className="h-fit mb-[17.88px]">
                                    Exit
                                </Button>
                            </div>
                        </GridView>
                        <GridView
                            className="p-2 lg:pt-4"
                            type="fixed"
                            cols="grid-cols-1 lg:grid-cols-2"
                        >
                            <div>
                                <h3 className="text-xl mb-3">Claim expired lock</h3>
                                <p>Claim your VMEX from expired veVMEX lock.</p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-1 lg:gap-2 content-end items-end">
                                <StakeInput header="Unlocked VMEX" onChange={() => {}} value="" />
                                <Button type="accent" className="h-fit mb-[17.88px]">
                                    Claim
                                </Button>
                            </div>
                        </GridView>
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={tabIndex} index={2}>
                    <div className="flex flex-col divide-y divide-gray-300 dark:divide-gray-700">
                        <GridView
                            className="p-2 pt-1"
                            type="fixed"
                            cols="grid-cols-1 lg:grid-cols-2"
                        >
                            <div>
                                <h3 className="text-xl mb-3">Gauge Rewards</h3>
                                <p>
                                    Select a gauge and claim any dVMEX rewards you’re eligible for.
                                    Remember, to earn rewards you must stake your Vault token into
                                    the corresponding gauge.
                                </p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-1 lg:gap-2 content-end items-end">
                                <StakeInput
                                    header="Unclaimed rewards (dVMEX)"
                                    onChange={() => {}}
                                    value=""
                                />
                                <Button type="accent" className="h-fit mb-[17.88px]">
                                    Claim
                                </Button>
                            </div>
                        </GridView>
                        <GridView
                            className="p-2 lg:pt-4"
                            type="fixed"
                            cols="grid-cols-1 lg:grid-cols-2"
                        >
                            <div>
                                <h3 className="text-xl mb-3">veVMEX boost rewards</h3>
                                <p>
                                    These are rewards clawed from the game theoretically suboptimal
                                    hands of gauge stakers who farm without a max boost. Their loss
                                    is your gain (literally).
                                </p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-1 lg:gap-2 content-end items-end">
                                <StakeInput
                                    header="Unclaimed veVMEX boost rewards (dVMEX)"
                                    onChange={() => {}}
                                    value=""
                                />
                                <Button type="accent" className="h-fit mb-[17.88px]">
                                    Claim
                                </Button>
                            </div>
                        </GridView>
                        <GridView
                            className="p-2 lg:pt-4"
                            type="fixed"
                            cols="grid-cols-1 lg:grid-cols-2"
                        >
                            <div>
                                <h3 className="text-xl mb-3">veVMEX exit rewards</h3>
                                <p>
                                    When some spaghetti handed locker takes an early exit from their
                                    veVMEX lock, their penalty is distributed amongst other lockers.
                                    It’s like a loyalty bonus, but instead of cheaper groceries you
                                    get sweet sweet VMEX.
                                </p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-1 lg:gap-2 content-end items-end">
                                <StakeInput
                                    header="Unclaimed veVMEX exit rewards (VMEX)"
                                    onChange={() => {}}
                                    value=""
                                />
                                <Button type="accent" className="h-fit mb-[17.88px]">
                                    Claim
                                </Button>
                            </div>
                        </GridView>
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={tabIndex} index={3}>
                    <div className="flex flex-col divide-y divide-gray-300 dark:divide-gray-700">
                        <GridView
                            className="p-2 pt-1"
                            type="fixed"
                            cols="grid-cols-1 lg:grid-cols-2"
                        >
                            <div>
                                <h3 className="text-xl mb-3">Redeem</h3>
                                <p>
                                    Got dVMEX, want VMEX? You’ve come to the right place. Redeem
                                    dVMEX for VMEX by paying the redemption cost in ETH. Enjoy your
                                    cheap VMEX anon.
                                </p>
                                <p className="font-bold mt-2">
                                    Current Discount: {percentFormatter.format(0)}
                                </p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-1 lg:gap-2 content-end items-end">
                                <StakeInput
                                    header="dVMEX to use"
                                    onChange={() => {}}
                                    value=""
                                    max="0"
                                />
                                <StakeInput
                                    header="Redemption cost (ETH)"
                                    onChange={() => {}}
                                    value=""
                                    disabled
                                />
                                <StakeInput
                                    header="Redeems VMEX"
                                    onChange={() => {}}
                                    value=""
                                    disabled
                                />
                                <Button type="accent" className="h-fit mb-[17.88px]">
                                    Redeem
                                </Button>
                            </div>
                        </GridView>
                    </div>
                </CustomTabPanel>
            </Card>
        </Base>
    );
};
export default Staking;
