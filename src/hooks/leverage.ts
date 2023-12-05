import { IDialogProps, ISupplyBorrowProps } from '../ui/modals';
import { useEffect, useState } from 'react';
import { IUseModal } from './modal';
import { useSubgraphTrancheData, useUserData, useUserTrancheData } from '../api';
import { useAccount, useSigner } from 'wagmi';
import {
    NETWORKS,
    convertStringFormatToNumber,
    PRICING_DECIMALS,
    bigNumberToUSD,
    getNetworkName,
    bigNumberToUnformattedString,
    DECIMALS,
} from '../utils';
import { BigNumber, Wallet, utils } from 'ethers';
import { estimateGas, supply } from '@vmexfinance/sdk';
import { toast } from 'react-toastify';
import { IYourSuppliesTableItemProps } from '@/ui/tables';

export const useLeverage = ({
    data,
    submitTx,
    isSuccess,
    error,
    isLoading,
    view,
    setView,
    isMax,
    amount,
    setAmount,
    setIsMax,
}: IDialogProps & IUseModal) => {
    const { address } = useAccount();
    const network = getNetworkName();
    const { findAssetInMarketsData } = useSubgraphTrancheData(data?.trancheId || 0);
    const { data: signer } = useSigner();
    const { getTokenBalance } = useUserData(address);
    const { findAssetInUserSuppliesOrBorrows, queryUserRewardsData, queryRewardsData } =
        useUserTrancheData(address, data?.trancheId || 0);

    // States
    const [estimatedGasCost, setEstimatedGasCost] = useState({
        cost: '0',
        loading: false,
        errorMessage: '',
    });
    const [asset, setAsset] = useState(data?.asset || '');

    // User Wallet
    const amountWalletNative = getTokenBalance(asset || '');
    const apy = findAssetInMarketsData(asset || '')?.supplyRate;
    const amountWithdraw =
        findAssetInUserSuppliesOrBorrows(asset, 'supply')?.amountNative || data?.amountNative;
    const collateral = (
        findAssetInUserSuppliesOrBorrows(asset || '', 'supply') as IYourSuppliesTableItemProps
    )?.collateral;

    const defaultFunctionParams = {
        trancheId: data ? data.trancheId : 0,
        amount: convertStringFormatToNumber(amount),
        signer: signer
            ? signer
            : new Wallet('0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'),
        network,
        isMax: isMax,
        test: NETWORKS[network].testing,
        providerRpc: NETWORKS[network].rpc,
    };

    // Modal Functions
    const maxOnClick = () => {
        setAmount(
            view?.includes('Supply')
                ? bigNumberToUnformattedString(amountWalletNative.amountNative, asset || '')
                : bigNumberToUnformattedString(amountWithdraw, asset || ''),
        );
        setIsMax(true);
    };

    const handleSubmit = async () => {
        if (signer && data) {
            await submitTx(async () => {
                // TODO: implement leverage function
                const res = await supply({
                    ...defaultFunctionParams,
                    underlying: asset,
                });
                return res;
            });
        }
    };

    // Checks and balances
    const isViolatingMax = () => {
        if (asset && amount) {
            if (amount.includes('.') && amount.split('.')[1].length > (DECIMALS.get(asset) || 18)) {
                return true;
            } else {
                const inputAmount = utils.parseUnits(amount, DECIMALS.get(asset));
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
        return isSuccess || error.length !== 0;
    };

    // Use effects
    useEffect(() => {
        const getter = async () => {
            setEstimatedGasCost({ ...estimatedGasCost, loading: true });
            if (signer && data) {
                try {
                    const res = await estimateGas({
                        ...defaultFunctionParams,
                        function: 'withdraw',
                        asset: asset,
                    });
                    setEstimatedGasCost({
                        loading: false,
                        cost: `${String(bigNumberToUSD(res, PRICING_DECIMALS[network]))}`,
                        errorMessage: '',
                    });
                } catch (err: any) {
                    setEstimatedGasCost({
                        loading: false,
                        cost: `$0`,
                        errorMessage: err.toString(),
                    });
                }
            }
        };
        getter();
    }, [view, data, isMax, amount, signer]);

    return {
        view,
        setView,
        isLoading,
        isSuccess,
        error,
        asset,
        estimatedGasCost,
        isButtonDisabled,
        handleSubmit,
        setAmount,
        amountWithdraw,
        amount,
        amountWalletNative,
        isMax,
        setIsMax,
        isViolatingMax,
        maxOnClick,
    };
};
