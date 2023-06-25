import React, { useEffect, useState } from 'react';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useDialogController, useModal } from '../../../hooks';
import { supply, withdraw, estimateGas, claimIncentives } from '@vmexfinance/sdk';
import {
    NETWORK,
    convertStringFormatToNumber,
    unformattedStringToBigNumber,
    bigNumberToNative,
    bigNumberToUnformattedString,
    SDK_PARAMS,
    DECIMALS,
    bigNumberToUSD,
    REVERSE_MAINNET_ASSET_MAPPINGS,
} from '../../../utils';
import {
    HealthFactor,
    ActiveStatus,
    TransactionStatus,
    Button,
    CoinInput,
    MessageStatus,
    Tooltip,
    BasicToggle,
} from '../../components';
import { useSubgraphTrancheData, useUserData, useUserTrancheData } from '../../../api';
import { useSigner, useAccount } from 'wagmi';
import { BigNumber, utils, Wallet } from 'ethers';
import { IYourSuppliesTableItemProps } from '@ui/tables';
import { ISupplyBorrowProps } from '../utils';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '../../../store';

export const SupplyAssetDialog: React.FC<ISupplyBorrowProps> = ({ data }) => {
    const {
        submitTx,
        isSuccess,
        error,
        isLoading,
        view,
        setView,
        isMax,
        setIsMax,
        amount,
        setAmount,
    } = useModal('loan-asset-dialog');
    const { findAssetInMarketsData } = useSubgraphTrancheData(data?.trancheId || 0);
    const { data: signer } = useSigner();
    const { address } = useAccount();
    const { findAssetInUserSuppliesOrBorrows, queryUserRewardsData, queryRewardsData } =
        useUserTrancheData(address, data?.trancheId || 0);
    const { getTokenBalance } = useUserData(address);
    const navigate = useNavigate();
    const { setAsset } = useSelectedTrancheContext();
    const { closeDialog, openDialog } = useDialogController();

    const [asCollateral, setAsCollateral] = useState<any>(data?.collateral);
    const [existingSupplyCollateral, setExistingSupplyCollateral] = useState(false);
    const [estimatedGasCost, setEstimatedGasCost] = useState({ cost: '0', loading: false });

    const amountWalletNative = getTokenBalance(data?.asset || '');
    const apy = findAssetInMarketsData(data?.asset || '')?.supplyRate;
    const amountWithdraw =
        findAssetInUserSuppliesOrBorrows(data?.asset, 'supply')?.amountNative || data?.amountNative;
    const collateral = (
        findAssetInUserSuppliesOrBorrows(data?.asset || '', 'supply') as IYourSuppliesTableItemProps
    )?.collateral;

    const defaultFunctionParams = {
        trancheId: data ? data.trancheId : 0,
        amount: convertStringFormatToNumber(amount),
        signer: signer
            ? signer
            : new Wallet('0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'),
        network: NETWORK,
        isMax: isMax,
        test: SDK_PARAMS.test,
        providerRpc: SDK_PARAMS.providerRpc,
    };

    const handleSubmit = async () => {
        if (signer && data) {
            await submitTx(async () => {
                let res;
                if (view?.includes('Supply')) {
                    res = await supply({
                        ...defaultFunctionParams,
                        underlying: data.asset,
                        collateral:
                            typeof collateral === 'boolean'
                                ? existingSupplyCollateral
                                : asCollateral,
                        // referrer: number,
                        // collateral: boolean,
                    });
                } else if (view?.includes('Claim')) {
                    if (queryRewardsData.data) {
                        res = await claimIncentives({
                            ...defaultFunctionParams,
                            to: await defaultFunctionParams.signer.getAddress(),
                            incentivizedATokens: queryRewardsData.data.map<string>((el): string => {
                                return el.aTokenAddress;
                            }),
                        });
                    }
                } else {
                    res = await withdraw({
                        ...defaultFunctionParams,
                        asset: data.asset,
                        interestRateMode: 2,
                        // referrer: number,
                        // collateral: boolean,
                        // test: boolean
                    });
                }
                return res;
            });
        }
    };

    const maxOnClick = () => {
        setAmount(
            view?.includes('Supply')
                ? bigNumberToUnformattedString(amountWalletNative.amountNative, data?.asset || '')
                : bigNumberToUnformattedString(amountWithdraw, data?.asset || ''),
        );
        setIsMax(true);
    };

    const isViolatingSupplyCap = function () {
        if (!amount || !view?.includes('Supply')) return false;
        const supplyCap = Number(findAssetInMarketsData(data?.asset || '')?.supplyCap);
        const currentSupplied = Number(findAssetInMarketsData(data?.asset || '')?.totalSupplied); //already considers decimals
        const newTotalSupply = Number(amount) + currentSupplied;
        if (newTotalSupply > supplyCap) {
            return true;
        }
        return false;
    };

    const isViolatingMax = () => {
        if (data?.asset && amount) {
            if (
                amount.includes('.') &&
                amount.split('.')[1].length > (DECIMALS.get(data.asset) || 18)
            ) {
                return true;
            } else {
                const inputAmount = utils.parseUnits(amount, DECIMALS.get(data.asset));
                return inputAmount.gt(
                    view?.includes('Supply')
                        ? amountWalletNative.amountNative
                        : amountWithdraw || BigNumber.from('0'),
                );
            }
        }
        return false;
    };

    const isButtonDisabled = () => {
        if (view?.includes('Claim')) {
            return false;
        } else {
            return (
                isSuccess ||
                error.length !== 0 ||
                (!amount && !isMax) ||
                (view?.includes('Supply') && amountWalletNative.amountNative.lt(10)) ||
                (view?.includes('Withdraw') && (!amountWithdraw || amountWithdraw.lt(10))) ||
                isViolatingSupplyCap() ||
                isViolatingMax()
            );
        }
    };

    useEffect(() => {
        if (data?.view) setView('Withdraw');
    }, [data?.view, setView]);

    useEffect(() => {
        if (typeof collateral === 'boolean') setExistingSupplyCollateral(collateral);
    }, [collateral]);

    useEffect(() => {
        const getter = async () => {
            setEstimatedGasCost({ ...estimatedGasCost, loading: true });
            if (signer && data) {
                let res;
                if (view?.includes('Supply')) {
                    res = await estimateGas({
                        ...defaultFunctionParams,
                        function: 'supply',
                        underlying: data.asset,
                    });
                } else if (view?.includes('Claim')) {
                    // TODO: add claim estimate gas
                    res = BigNumber.from('0');
                } else {
                    res = await estimateGas({
                        ...defaultFunctionParams,
                        function: 'withdraw',
                        asset: data.asset,
                    });
                }
                setEstimatedGasCost({
                    loading: false,
                    cost: bigNumberToUSD(res, DECIMALS.get(data.asset) || 18),
                });
            }
        };
        getter();
    }, [view, data, isMax, amount, signer]);

    return data && data.asset ? (
        <>
            <ModalHeader
                dialog="loan-asset-dialog"
                tabs={['Supply', 'Withdraw', 'Claim']}
                onClick={setView}
                active={view}
            />
            {view?.includes('Supply') ? (
                !isSuccess && !error ? (
                    // Default State
                    <>
                        <h3 className="mt-5 text-neutral400">Amount</h3>
                        <CoinInput
                            amount={amount}
                            setAmount={setAmount}
                            coin={{
                                logo: `/coins/${data.asset?.toLowerCase()}.svg`,
                                name: data.asset,
                            }}
                            balance={bigNumberToUnformattedString(
                                amountWalletNative.amountNative,
                                data.asset,
                            )}
                            isMax={isMax}
                            setIsMax={setIsMax}
                            loading={amountWalletNative.loading}
                            customMaxClick={maxOnClick}
                        />
                        <MessageStatus
                            type="error"
                            show={isViolatingMax()}
                            message="Input amount is over the max"
                        />
                        <MessageStatus
                            type="warning"
                            show={isViolatingSupplyCap()}
                            message="WARNING: Attempting to supply more than the supply cap"
                        />

                        <h3 className="mt-6">Collaterize</h3>
                        <div className="mt-1">
                            {typeof collateral === 'boolean' ? (
                                <Tooltip
                                    text={`Your previous supply is ${
                                        collateral === false ? 'not' : ''
                                    } collateralized.`}
                                    content={
                                        <BasicToggle
                                            checked={existingSupplyCollateral}
                                            disabled={!data?.collateral}
                                            onClick={(e: any) => {
                                                e.preventDefault();
                                                openDialog('toggle-collateral-dialog', {
                                                    ...data,
                                                    collateral: collateral,
                                                    setCollateral: setExistingSupplyCollateral,
                                                });
                                                e.stopPropagation();
                                            }}
                                        />
                                    }
                                />
                            ) : (
                                <BasicToggle
                                    checked={asCollateral}
                                    onChange={() => setAsCollateral(!asCollateral)}
                                    disabled={!data?.collateral}
                                />
                            )}
                        </div>

                        <h3 className="mt-6 text-neutral400">Health Factor</h3>
                        <HealthFactor
                            asset={data.asset}
                            amount={amount}
                            type={'supply'}
                            trancheId={String(data?.trancheId)}
                        />

                        <ModalTableDisplay
                            title="Transaction Overview"
                            content={[
                                {
                                    label: 'Supply APR',
                                    value: `${apy || '0.00%'}`,
                                },
                                {
                                    label: 'Collateralization',
                                    value: <ActiveStatus active={asCollateral} size="sm" />,
                                },
                                {
                                    label: 'Estimated Gas',
                                    value: estimatedGasCost.cost,
                                    loading: estimatedGasCost.loading,
                                },
                            ]}
                        />
                    </>
                ) : (
                    <div className="mt-10 mb-8">
                        <TransactionStatus success={isSuccess} errorText={error} full />
                    </div>
                )
            ) : view?.includes('Claim') ? (
                <>
                    <ModalTableDisplay
                        title="Rewards"
                        content={
                            queryUserRewardsData.data?.rewardTokens?.map((el: string, idx) => {
                                return {
                                    label:
                                        REVERSE_MAINNET_ASSET_MAPPINGS.get(el.toLowerCase()) || el,
                                    value: `${queryUserRewardsData.data?.rewardAmounts[idx]}`,
                                };
                            }) || []
                        }
                    />
                </>
            ) : !isSuccess && !error ? (
                // Default State
                <>
                    <h3 className="mt-5 text-neutral400">Amount</h3>
                    <CoinInput
                        amount={amount}
                        setAmount={setAmount}
                        coin={{
                            logo: `/coins/${data.asset?.toLowerCase()}.svg`,
                            name: data.asset,
                        }}
                        balance={bigNumberToUnformattedString(
                            amountWithdraw || BigNumber.from('0'),
                            data.asset,
                        )}
                        isMax={isMax}
                        setIsMax={setIsMax}
                        loading={Number(bigNumberToNative(amountWithdraw, data.asset)) === 0}
                        customMaxClick={maxOnClick}
                    />
                    <MessageStatus
                        type="error"
                        show={isViolatingMax()}
                        message="Input amount is over the max"
                    />

                    <h3 className="mt-6 text-neutral400">Health Factor</h3>
                    <HealthFactor
                        asset={data.asset}
                        amount={amount}
                        type={'withdraw'}
                        trancheId={String(data?.trancheId)}
                    />

                    <ModalTableDisplay
                        title="Transaction Overview"
                        content={[
                            {
                                label: 'Remaining Supply',
                                value:
                                    amount && amountWithdraw
                                        ? bigNumberToNative(
                                              amountWithdraw.sub(
                                                  unformattedStringToBigNumber(amount, data.asset),
                                              ),
                                              data.asset,
                                          )
                                        : bigNumberToNative(amountWithdraw, data.asset),
                                loading:
                                    Number(bigNumberToNative(amountWithdraw, data.asset)) === 0,
                            },
                            {
                                label: 'Estimated Gas',
                                value: estimatedGasCost.cost,
                                loading: estimatedGasCost.loading,
                            },
                        ]}
                    />
                </>
            ) : (
                <div className="mt-10 mb-8">
                    <TransactionStatus full success={isSuccess} errorText={error} />
                </div>
            )}

            <ModalFooter between={!location.hash.includes('tranches')}>
                {!location.hash.includes('tranches') && (
                    <Button
                        label={`View Tranche`}
                        onClick={() => {
                            setAsset(data.asset);
                            closeDialog('loan-asset-dialog');
                            window.scroll(0, 0);
                            navigate(
                                `/tranches/${data.tranche?.toLowerCase().replace(/\s+/g, '-')}`,
                                {
                                    state: { view: 'details', trancheId: data.trancheId },
                                },
                            );
                        }}
                    />
                )}
                {Number(amount) === 0 && !view?.includes('Claim') ? (
                    <Tooltip
                        text="Please enter an amount"
                        content={<Button primary label={'Submit Transaction'} disabled />}
                    />
                ) : (
                    <Button
                        primary
                        disabled={isButtonDisabled()}
                        onClick={handleSubmit}
                        label={view?.includes('Claim') ? 'Claim Rewards' : 'Submit Transaction'}
                        loading={isLoading}
                        loadingText="Submitting"
                    />
                )}
            </ModalFooter>
        </>
    ) : (
        <></>
    );
};
