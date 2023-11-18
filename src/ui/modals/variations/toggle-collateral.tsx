import React from 'react';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader } from '../subcomponents';
import { Button, HealthFactor, TransactionStatus } from '@/ui/components';
import { useSigner } from 'wagmi';
import { useModal } from '@/hooks';
import { markReserveAsCollateral } from '@vmexfinance/sdk';
import { ethers } from 'ethers';
import { NETWORKS, DECIMALS, getNetworkName } from '@/utils';

export const ToggleCollateralDialog: React.FC<IDialogProps> = ({
    name,
    isOpen,
    data,
    closeDialog,
}) => {
    const { submitTx, isLoading, isSuccess, error } = useModal('confirmation-dialog');
    const { data: signer } = useSigner();
    const network = getNetworkName();

    const handleCollateral = async () => {
        if (signer) {
            let newArr = data.checked ? [...data.checked] : []; // copying the old datas array
            newArr[data.index] = !newArr[data.index];
            await submitTx(async () => {
                const res = await markReserveAsCollateral({
                    signer: signer,
                    network,
                    asset: data.asset,
                    trancheId: data.trancheId,
                    useAsCollateral: !data.collateral,
                    test: NETWORKS[network].testing,
                    providerRpc: NETWORKS[network].rpc,
                });
                if (data.setChecked) data.setChecked(newArr);
                if (data.setCollateral && !data.setChecked) data.setCollateral(!data.collateral);
                closeDialog && closeDialog('toggle-collateral-dialog');
                return res;
            });
        }
    };

    return (
        data &&
        data.asset && (
            <>
                <ModalHeader
                    dialog="toggle-collateral-dialog"
                    tabs={[`${data.collateral ? 'Disable' : 'Enable'} ${name}`]}
                    asset={data.asset}
                />
                {!isSuccess ? (
                    // Default State
                    <div className="py-6">
                        <p>
                            Are you sure you want to {data.collateral ? 'disable ' : 'enable '}
                            collateral for this asset? This will{' '}
                            {data.collateral ? 'lower' : 'raise'} your health score.
                        </p>

                        <div className="text-center text-sm flex flex-col items-center mt-4">
                            <span>Current Health Factor</span>
                            <HealthFactor
                                asset={data.asset}
                                trancheId={data?.trancheId}
                                amount={ethers.utils.formatUnits(
                                    data.amountNative,
                                    DECIMALS.get(data.asset),
                                )}
                                type={data.collateral ? 'disable collateral' : 'enable collateral'}
                                withChange={true}
                                center
                                size="lg"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="mt-10 mb-8">
                        <TransactionStatus success={isSuccess} errorText={error} full />
                    </div>
                )}

                <ModalFooter>
                    <Button
                        type="accent"
                        disabled={isSuccess || isLoading}
                        onClick={() => handleCollateral() as any}
                        loading={isLoading}
                        loadingText="Submitting"
                    >
                        Submit Transaction
                    </Button>
                </ModalFooter>
            </>
        )
    );
};
