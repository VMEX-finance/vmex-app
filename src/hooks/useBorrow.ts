import { ISupplyBorrowProps } from '../ui/modals';
import { IUseModal } from './useModal';
import { useEffect, useState } from 'react';
import { BigNumber, Wallet, utils } from 'ethers';
import {
    DECIMALS,
    NETWORK,
    SDK_PARAMS,
    bigNumberToUSD,
    bigNumberToUnformattedString,
    convertStringFormatToNumber,
} from '../utils';
import { borrow, estimateGas, repay } from '@vmexfinance/sdk';
import { useAccount, useSigner } from 'wagmi';
import { useSubgraphTrancheData, useUserTrancheData } from '../api';

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
    const { address } = useAccount();
    const { data: signer } = useSigner();
    const { findAssetInUserSuppliesOrBorrows, findAmountBorrowable } = useUserTrancheData(
        address,
        data?.trancheId || 0,
    );
    const { findAssetInMarketsData } = useSubgraphTrancheData(data?.trancheId || 0);

    const [estimatedGasCost, setEstimatedGasCost] = useState({ cost: '0', loading: false });

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

    const handleClick = async () => {
        if (data && signer) {
            await submitTx(async () => {
                const res = view?.includes('Borrow')
                    ? await borrow({
                          ...defaultFunctionParams,
                          underlying: data.asset,
                          isMax: false, // TODO: fix in SDK as isMax: true breaks the app
                          //   interestRateMode: 2,
                          // referrer: number,
                          // collateral: boolean,
                      })
                    : await repay({
                          ...defaultFunctionParams,
                          asset: data.asset,
                          //   rateMode: 2,
                          // referrer: number,
                          // collateral: boolean,
                      });
                return res;
            });
        }
    };

    const amountBorrwable = findAmountBorrowable(
        data?.asset || '',
        findAssetInMarketsData(data?.asset || '')?.liquidity,
        findAssetInMarketsData(data?.asset || '')?.decimals,
        findAssetInMarketsData(data?.asset || '')?.priceUSD,
    );
    const apy = findAssetInMarketsData(data?.asset || '')?.borrowRate;
    const amountRepay =
        findAssetInUserSuppliesOrBorrows(data?.asset, 'borrow')?.amountNative ||
        data?.amountNative ||
        BigNumber.from('0');

    const isViolatingBorrowCap = function () {
        if (!amount || !view?.includes('Borrow')) return false;
        const borrowCap = Number(findAssetInMarketsData(data?.asset || '')?.borrowCap);
        const currentBorrowed = Number(findAssetInMarketsData(data?.asset || '')?.totalBorrowed); //already considers decimals
        const newTotalBorrow = Number(amount) + currentBorrowed;

        if (newTotalBorrow > borrowCap) {
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
                    view?.includes('Borrow') ? amountBorrwable.amountNative : amountRepay,
                );
            }
        }
        return false;
    };

    const maxOnClick = () => {
        setAmount(
            view?.includes('Borrow')
                ? bigNumberToUnformattedString(amountBorrwable.amountNative, data?.asset || '')
                : bigNumberToUnformattedString(amountRepay, data?.asset || ''),
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
            isViolatingMax()
        );
    };

    useEffect(() => {
        if (data?.view) setView('Repay');
    }, [data?.view]);

    useEffect(() => {
        const getter = async () => {
            setEstimatedGasCost({ ...estimatedGasCost, loading: true });
            if (signer && data) {
                const res = view?.includes('Borrow')
                    ? await estimateGas({
                          ...defaultFunctionParams,
                          function: 'borrow',
                          underlying: data.asset,
                      })
                    : await estimateGas({
                          ...defaultFunctionParams,
                          function: 'repay',
                          asset: data.asset,
                      });
                setEstimatedGasCost({
                    cost: bigNumberToUSD(res, DECIMALS.get(data.asset) || 18),
                    loading: false,
                });
            }
        };
        getter();
    }, [view, data, isMax, amount, signer]);

    return {
        amountBorrwable,
        amountRepay,
        isViolatingMax,
        isViolatingBorrowCap,
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
    };
};
