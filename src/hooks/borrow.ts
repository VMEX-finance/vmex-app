import { ISupplyBorrowProps } from '../ui/modals';
import { IUseModal } from './modal';
import { useEffect, useState } from 'react';
import { BigNumber, Wallet, utils } from 'ethers';
import {
    DECIMALS,
    NETWORKS,
    DEFAULT_NETWORK,
    bigNumberToUSD,
    bigNumberToUnformattedString,
    convertStringFormatToNumber,
    PRICING_DECIMALS,
    TESTING,
} from '../utils';
import { borrow, estimateGas, repay } from '@vmexfinance/sdk';
import { useAccount, useSigner } from 'wagmi';
import { useSubgraphTrancheData, useUserData, useUserTrancheData } from '../api';
import { getNetwork } from '@wagmi/core';

export const useBorrow = ({
    data,
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
}: ISupplyBorrowProps & IUseModal) => {
    const network = getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;
    const { address } = useAccount();
    const { data: signer } = useSigner();
    const { findAssetInUserSuppliesOrBorrows, findAmountBorrowable } = useUserTrancheData(
        address,
        data?.trancheId || 0,
    );
    const { findAssetInMarketsData } = useSubgraphTrancheData(data?.trancheId || 0);
    const { getTokenBalance } = useUserData(address);

    const [estimatedGasCost, setEstimatedGasCost] = useState({
        cost: '0',
        loading: false,
        errorMessage: '',
    });
    const [asset, setAsset] = useState(data?.asset || '');
    const amountWalletNative = getTokenBalance(asset || '');

    const toggleEthWeth = () => {
        if (data?.asset.toLowerCase() === 'weth') {
            if (asset.toLowerCase() === 'weth') setAsset('ETH');
            else setAsset('WETH');
        }
    };

    const defaultFunctionParams = {
        trancheId: data ? data.trancheId : 0,
        amount: convertStringFormatToNumber(amount),
        signer: signer
            ? signer
            : new Wallet('0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'),
        network,
        isMax: isMax,
        test: TESTING,
        providerRpc: NETWORKS[network].rpc,
    };

    const handleClick = async () => {
        if (data && signer) {
            await submitTx(async () => {
                const res = view?.includes('Borrow')
                    ? await borrow({
                          ...defaultFunctionParams,
                          underlying: asset,
                          isMax: false, // TODO: fix in SDK as isMax: true breaks the app
                          //   interestRateMode: 2,
                          // referrer: number,
                          // collateral: boolean,
                      })
                    : await repay({
                          ...defaultFunctionParams,
                          asset: asset,
                          //   rateMode: 2,
                          // referrer: number,
                          // collateral: boolean,
                      });
                return res;
            });
        }
    };

    const amountBorrwable = findAmountBorrowable(
        asset || '',
        findAssetInMarketsData(asset || '')?.liquidity,
        findAssetInMarketsData(asset || '')?.decimals,
        findAssetInMarketsData(asset || '')?.priceUSD,
    );
    const apy = findAssetInMarketsData(asset || '')?.borrowRate;
    const amountRepay =
        findAssetInUserSuppliesOrBorrows(asset, 'borrow')?.amountNative ||
        data?.amountNative ||
        BigNumber.from('0');

    const isViolatingBorrowCap = function () {
        if (!amount || !view?.includes('Borrow')) return false;
        const borrowCap = Number(findAssetInMarketsData(asset || '')?.borrowCap);
        const currentBorrowed = Number(findAssetInMarketsData(asset || '')?.totalBorrowed); //already considers decimals
        const newTotalBorrow = Number(amount) + currentBorrowed;

        if (newTotalBorrow > borrowCap) {
            return true;
        }
        return false;
    };

    const isViolatingMax = () => {
        if (asset && amount) {
            console.log('control');
            if (amount.includes('.') && amount.split('.')[1].length > (DECIMALS.get(asset) || 18)) {
                return true;
            } else {
                const inputAmount = utils.parseUnits(amount, DECIMALS.get(asset));
                return inputAmount.gt(
                    view?.includes('Borrow') ? amountBorrwable.amountNative : amountRepay,
                );
            }
        }
        return false;
    };

    const isViolatingMaxInWallet = () => {
        if (asset && amount) {
            if (!amount || !view?.includes('Repay')) return false;
            if (amount.includes('.') && amount.split('.')[1].length > (DECIMALS.get(asset) || 18)) {
                return true;
            } else {
                const inputAmount = utils.parseUnits(amount, DECIMALS.get(asset));
                return inputAmount.gt(amountWalletNative.amountNative);
            }
        }
        return false;
    };

    const maxOnClick = () => {
        setAmount(
            view?.includes('Borrow')
                ? bigNumberToUnformattedString(amountBorrwable.amountNative, asset || '')
                : bigNumberToUnformattedString(amountRepay, asset || ''),
        );
        setIsMax(true);
    };

    const isButtonDisabled = () => {
        return (
            isSuccess ||
            error.length !== 0 ||
            (!amount && !isMax) ||
            (view?.includes('Borrow') && amountBorrwable.amountNative.lt(10)) ||
            (view?.includes('Repay') && amountRepay.lt(10)) ||
            isViolatingBorrowCap() ||
            isViolatingMax() ||
            isViolatingMaxInWallet()
        );
    };

    useEffect(() => {
        if (data?.view) setView('Repay');
    }, [data?.view]);

    useEffect(() => {
        const getter = async () => {
            setEstimatedGasCost({ ...estimatedGasCost, loading: true });
            if (signer && data) {
                try {
                    const res = view?.includes('Borrow')
                        ? await estimateGas({
                              ...defaultFunctionParams,
                              function: 'borrow',
                              underlying: asset,
                          })
                        : await estimateGas({
                              ...defaultFunctionParams,
                              function: 'repay',
                              asset: asset,
                          });
                    setEstimatedGasCost({
                        cost: bigNumberToUSD(res, PRICING_DECIMALS[network]),
                        loading: false,
                        errorMessage: '',
                    });
                } catch (err: any) {
                    setEstimatedGasCost({
                        cost: '0',
                        loading: false,
                        errorMessage: err.toString(),
                    });
                }
            }
        };
        getter();
    }, [view, data, isMax, amount, signer]);

    return {
        amountBorrwable,
        amountRepay,
        isViolatingMax,
        isViolatingBorrowCap,
        isViolatingMaxInWallet,
        apy,
        estimatedGasCost,
        handleClick,
        isButtonDisabled,
        maxOnClick,
        view,
        isSuccess,
        amount,
        setAmount,
        isMax,
        setIsMax,
        error,
        isLoading,
        setView,
        toggleEthWeth,
        isEth: asset?.toLowerCase() === 'weth' && asset === 'ETH' ? true : false,
        asset,
    };
};
