import React from 'react';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader } from '../subcomponents';
import { Button, HealthFactor, TransactionStatus } from '../../components';
import { useSigner } from 'wagmi';
import { useModal } from '../../../hooks/modal';
import { markReserveAsCollateral } from '@vmexfinance/sdk';
import { NETWORK, SDK_PARAMS } from '../../../utils/sdk-helpers';

export const ToggleCollateralDialog: React.FC<IDialogProps> = ({
    name,
    isOpen,
    data,
    closeDialog,
}) => {
    const { submitTx, isLoading, isSuccess, error } = useModal('confirmation-dialog');
    const { data: signer } = useSigner();

    const handleCollateral = async () => {
        if (signer) {
            let newArr = data.checked ? [...data.checked] : []; // copying the old datas array
            newArr[data.index] = !newArr[data.index];
            await submitTx(async () => {
                const res = await markReserveAsCollateral({
                    signer: signer,
                    network: NETWORK,
                    asset: data.asset,
                    trancheId: data.trancheId,
                    useAsCollateral: !data.collateral,
                    test: SDK_PARAMS.test,
                    providerRpc: SDK_PARAMS.providerRpc,
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
                    <div className="py-8">
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
                                type={'no collateral'}
                                withChange={false}
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
                        primary
                        disabled={isSuccess || isLoading}
                        onClick={() => handleCollateral()}
                        label="Submit Transaction"
                        loading={isLoading}
                        loadingText="Submitting"
                    />
                </ModalFooter>
            </>
        )
    );
};
