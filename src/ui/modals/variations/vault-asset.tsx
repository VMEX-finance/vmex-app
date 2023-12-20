import React, { useEffect } from 'react';
import { FaGasPump } from 'react-icons/fa';
import { useMediatedState } from 'react-use';
import { inputMediator } from '@/utils';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useModal } from '@/hooks';
import {
    DefaultDropdown,
    Button,
    ActiveStatus,
    TransactionStatus,
    CoinInput,
} from '@/ui/components';

export const VaultAssetDialog: React.FC<IDialogProps> = ({ name, isOpen, data, closeDialog }) => {
    const { submitTx, isSuccess, isLoading, error, view, setView } = useModal('vault-asset-dialog');
    const [amount, setAmount] = useMediatedState(inputMediator, '');
    const [isMax, setIsMax] = React.useState(false);

    const handleSubmit = async () => {
        await submitTx();
    };

    useEffect(() => {
        if (data?.tab) {
            setView(data?.tab);
        }
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
                    {view === 'Deposit' ? (
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

                            <ModalTableDisplay
                                title="Transaction Overview"
                                content={
                                    [
                                        // {
                                        //     label: 'Supply APR (%)',
                                        //     value: `${0.44}%`,
                                        // },
                                        // {
                                        //     label: 'Collateralization',
                                        //     value: <ActiveStatus active={true} size="sm" />,
                                        // },
                                        // {
                                        //     label: 'Insurance',
                                        //     value: <ActiveStatus active={false} size="sm" />,
                                        // },
                                    ]
                                }
                            />
                        </>
                    ) : (
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

                            <ModalTableDisplay
                                title="Transaction Overview"
                                content={
                                    [
                                        // {
                                        //     label: 'Supply APR (%)',
                                        //     value: `${0.44}%`,
                                        // },
                                        // {
                                        //     label: 'Collateralization',
                                        //     value: <ActiveStatus active={true} size="sm" />,
                                        // },
                                        // {
                                        //     label: 'Insurance',
                                        //     value: <ActiveStatus active={false} size="sm" />,
                                        // },
                                    ]
                                }
                            />
                        </>
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
