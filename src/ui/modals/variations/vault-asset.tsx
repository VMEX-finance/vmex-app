import React, { useEffect } from 'react';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useModal, useVault } from '@/hooks';
import { Button, TransactionStatus, CoinInput } from '@/ui/components';

export const VaultAssetDialog: React.FC<IDialogProps> = ({ name, isOpen, data, closeDialog }) => {
    const { submitTx, isSuccess, isLoading, error, view, setView } = useModal('vault-asset-dialog');
    const { amount, setAmount, isMax, setIsMax, handleDeposit, handleWithdraw } = useVault(
        data?.vaultAddress,
    );

    const handleSubmit = async () => {
        if (view === 'Deposit') {
            await submitTx(() => {
                const res = handleDeposit();
                return res;
            }, true);
        } else {
            await submitTx(() => {
                const res = handleWithdraw();
                return res;
            }, true);
        }
    };

    useEffect(() => {
        if (data?.tab) setView(data?.tab);
    }, []);

    return (
        <>
            <ModalHeader
                dialog="vault-asset-dialog"
                tabs={[`Deposit`, 'Withdraw']}
                onClick={setView}
                active={view}
                disabled={isLoading}
            />
            {!isSuccess && !error ? (
                // Default State
                <>
                    <h3 className="mt-5 text-neutral400">Amount</h3>
                    <CoinInput
                        amount={amount}
                        setAmount={setAmount}
                        coin={{
                            logo: data.vaultIcon,
                            name: data.vaultSymbol,
                        }}
                        balance={'0.23'}
                        isMax={isMax}
                        setIsMax={setIsMax}
                    />
                    {view === 'Deposit' ? (
                        <ModalTableDisplay
                            title="Transaction Overview"
                            content={[
                                {
                                    label: 'Vault APR (%)',
                                    value: `${0.44}%`,
                                },
                            ]}
                        />
                    ) : (
                        <ModalTableDisplay
                            title="Transaction Overview"
                            content={[
                                {
                                    label: 'Remaining Supply',
                                    value: `0`,
                                },
                            ]}
                        />
                    )}
                </>
            ) : (
                <div className="mt-10 mb-8">
                    <TransactionStatus success={isSuccess} errorText={error} full />
                </div>
            )}

            <ModalFooter>
                <div>
                    <Button
                        disabled={isSuccess}
                        onClick={handleSubmit as any}
                        loading={isLoading}
                        type="accent"
                    >
                        Submit Transaction
                    </Button>
                </div>
            </ModalFooter>
        </>
    );
};
