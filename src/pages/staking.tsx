import React, { useEffect } from 'react';
import { GridView } from '@/ui/templates';
import { Base } from '@/ui/base';
import { StakingOverview } from '@/ui/features';
import {
    CONTRACTS,
    TESTING,
    getChainId,
    numberFormatter,
    percentFormatter,
    weeksToUnixBn,
} from '@/utils';
import { Button, Card, CustomTabPanel, CustomTabs, StakeInput } from '@/ui/components';
import { GaugesTable } from '@/ui/tables';
import { useLockingUI, useWindowSize, useToken } from '@/hooks';
import { BigNumber, utils } from 'ethers';
import { useAccount } from 'wagmi';
import { writeContract } from '@wagmi/core';
import { useVaults } from '@/api';

const Staking: React.FC = () => {
    const chainId = getChainId();
    const { address } = useAccount();
    const {
        handleExtendInput,
        handleLockAmountInput,
        handleLockPeriodInput,
        lockInput,
        extendInput,
        handleAmountMax,
        handlePeriodMax,
        amountInputError,
        periodInputError,
        inputError,
        handleRedeemAmountInput,
        handleRedeemMax,
        redeemInput,
        extendPeriodError,
        clearInputs,
    } = useLockingUI();
    const {
        vmexBalance,
        dvmexBalance,
        dvmexRedeem,
        inputToBn,
        vevmexIsApproved,
        lockVmex,
        tokenLoading,
        vevmexMetaData,
        vevmexUserData,
        extendVmexLockTime,
        vmexLockEarlyExitPenalty,
        vevmexRedeem,
        increaseVmexLockAmount,
        withdrawUnlockedVevmex,
        withdrawLockedVevmex,
    } = useToken(clearInputs);
    const { width, breakpoints } = useWindowSize();
    const [tabIndex, setTabIndex] = React.useState(0);
    const { queryVaults } = useVaults();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        const tabText = (event.target as any).innerText;
        setTabIndex(newValue);
    };

    const renderMinWeeks = () => {
        if (vevmexUserData?.data?.locked?.end?.normalized)
            return `${vevmexUserData?.data?.locked?.end?.normalized} weeks`;
        return '1 week';
    };

    // TESTING
    useEffect(() => {
        if (TESTING) {
            console.log('veVMEX:', vevmexMetaData.data);
            console.log('veVMEX User Data:', vevmexUserData.data);
        }
    }, [vevmexMetaData.data, vevmexUserData.data]);

    return (
        <Base
            title="staking"
            description={
                <>
                    {TESTING && chainId === 5 && address && (
                        <Button
                            onClick={async () => {
                                try {
                                    await writeContract({
                                        address: CONTRACTS[5].vmex as `0x${string}`,
                                        abi: ['function mint(address, uint256) external'],
                                        functionName: 'mint',
                                        args: [address, utils.parseEther('1000')],
                                        mode: 'recklesslyUnprepared',
                                    });
                                    console.log('Minted 1000 VMEX tokens');
                                } catch (e) {
                                    return;
                                }
                            }}
                        >
                            Mint 1000 VMEX
                        </Button>
                    )}
                </>
            }
        >
            <StakingOverview
                apr={percentFormatter.format(0)}
                totalLocked={vevmexMetaData.data?.supply || '0'}
                yourLocked={vevmexUserData?.data?.locked?.amount?.normalized || '0'}
                expiration={vevmexUserData?.data?.locked?.end?.normalized || '-'}
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
                        data={queryVaults.data}
                        loading={false}
                        error={queryVaults.isError}
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
                                    footer={
                                        inputError && amountInputError
                                            ? inputError
                                            : `Available: ${vmexBalance?.formatted || '0.0'} VMEX`
                                    }
                                    onChange={handleLockAmountInput}
                                    value={lockInput.amount}
                                    setMax={handleAmountMax}
                                    error={amountInputError}
                                    disabled={tokenLoading.lock || tokenLoading.lockApprove}
                                />
                                <StakeInput
                                    header="Current lock period (weeks)"
                                    footer={
                                        inputError && periodInputError
                                            ? inputError
                                            : `Minimum: ${renderMinWeeks()}`
                                    }
                                    onChange={handleLockPeriodInput}
                                    value={lockInput.period}
                                    setMax={handlePeriodMax}
                                    error={periodInputError}
                                    disabled={tokenLoading.lock || tokenLoading.lockApprove}
                                />
                                <StakeInput
                                    header="Total veVMEX"
                                    value={lockInput.amount}
                                    disabled
                                />
                                <Button
                                    type="accent"
                                    className="h-fit mb-[17.88px]"
                                    onClick={() =>
                                        lockVmex(
                                            lockInput.amountBn,
                                            weeksToUnixBn(Number(lockInput.period)),
                                        )
                                    } // TODO: check if time to unlock is correct
                                    disabled={
                                        !!inputError || !lockInput.amount || !lockInput.period
                                    }
                                    loading={tokenLoading.lock || tokenLoading.lockApprove}
                                    loadingText={
                                        vevmexIsApproved &&
                                        vevmexIsApproved.gte(lockInput.amountBn) &&
                                        vevmexIsApproved.toString() !== '0'
                                            ? 'Submitting'
                                            : 'Approving'
                                    }
                                >
                                    {vevmexIsApproved &&
                                    vevmexIsApproved.gte(lockInput.amountBn) &&
                                    vevmexIsApproved.toString() !== '0'
                                        ? 'Submit'
                                        : 'Approve'}
                                </Button>
                            </div>
                        </GridView>
                        <div
                            className={`${
                                vevmexUserData?.data?.votingPower &&
                                vevmexUserData?.data?.votingPower !== '0.0'
                                    ? ''
                                    : 'opacity-60 blur-[0.5px] !pointer-events-none'
                            } flex flex-col divide-y divide-gray-300 dark:divide-gray-700`}
                        >
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
                                        value={vevmexUserData?.data?.locked?.end?.normalized || ''}
                                        disabled
                                    />
                                    <StakeInput
                                        header="Increase lock period (weeks)"
                                        footer={
                                            inputError && extendPeriodError
                                                ? inputError
                                                : `Minimum: 1 week`
                                        }
                                        onChange={handleExtendInput}
                                        value={extendInput.period}
                                        error={extendPeriodError}
                                    />
                                    <StakeInput
                                        header="Total veVMEX"
                                        disabled
                                        onChange={() => {}}
                                        value={
                                            vevmexUserData?.data?.locked?.amount?.normalized || ''
                                        }
                                    />
                                    <Button
                                        type="accent"
                                        className="h-fit mb-[17.88px]"
                                        onClick={() => extendVmexLockTime(extendInput.periodBn)}
                                    >
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
                                    <StakeInput
                                        header="veVMEX you have"
                                        onChange={() => {}}
                                        value={
                                            vevmexUserData?.data?.locked?.amount?.normalized || ''
                                        }
                                    />
                                    <StakeInput
                                        header="Current lock time (weeks)"
                                        disabled
                                        onChange={() => {}}
                                        value={vevmexUserData?.data?.locked?.end?.normalized || ''}
                                    />
                                    <StakeInput
                                        header="VMEX you get"
                                        footer={`Penalty: ${utils.formatEther(
                                            vmexLockEarlyExitPenalty?.data || BigNumber.from(0),
                                        )}`}
                                        onChange={() => {}}
                                        disabled
                                        value={vevmexUserData?.data?.exitPreview || ''}
                                    />
                                    <Button
                                        type="accent"
                                        className="h-fit mb-[17.88px]"
                                        onClick={withdrawLockedVevmex}
                                        disabled
                                    >
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
                                    <StakeInput
                                        header="Unlocked VMEX"
                                        disabled
                                        onChange={() => {}}
                                        value=""
                                    />
                                    <Button
                                        type="accent"
                                        className="h-fit mb-[17.88px]"
                                        onClick={withdrawUnlockedVevmex}
                                        disabled
                                    >
                                        Claim
                                    </Button>
                                </div>
                            </GridView>
                        </div>
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
                                <Button type="accent" className="h-fit mb-[17.88px]" disabled>
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
                                <Button type="accent" className="h-fit mb-[17.88px]" disabled>
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
                                <Button type="accent" className="h-fit mb-[17.88px]" disabled>
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
                                    footer={`Available: ${dvmexBalance?.formatted || '0.0'} VMEX`}
                                    onChange={handleRedeemAmountInput}
                                    value={redeemInput.amount}
                                    setMax={handleRedeemMax}
                                    error={amountInputError}
                                    disabled={tokenLoading.redeem || tokenLoading.redeemApprove}
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
                                <Button
                                    type="accent"
                                    className="h-fit mb-[17.88px]"
                                    onClick={() => dvmexRedeem(redeemInput.amountBn)}
                                    disabled={!redeemInput?.amount}
                                >
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
