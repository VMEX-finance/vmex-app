import { IDialogProps, ISupplyBorrowProps } from '../ui/modals';
import { useEffect, useState } from 'react';
import { IUseModal } from './modal';
import { useSubgraphTrancheData } from '../api';
import { useSigner } from 'wagmi';
import {
    NETWORKS,
    convertStringFormatToNumber,
    PRICING_DECIMALS,
    bigNumberToUSD,
    getNetworkName,
} from '../utils';
import { Wallet } from 'ethers';
import { estimateGas, supply } from '@vmexfinance/sdk';
import { toast } from 'react-toastify';

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
}: IDialogProps & IUseModal) => {
    const network = getNetworkName();
    const { findAssetInMarketsData } = useSubgraphTrancheData(data?.trancheId || 0);
    const { data: signer } = useSigner();

    console.log('data', data);

    const [estimatedGasCost, setEstimatedGasCost] = useState({
        cost: '0',
        loading: false,
        errorMessage: '',
    });
    const [asset, setAsset] = useState(data?.asset || '');

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

    const isButtonDisabled = () => {
        return isSuccess || error.length !== 0;
    };

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
    };
};
