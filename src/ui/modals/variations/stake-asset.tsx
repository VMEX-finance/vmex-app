import React from 'react';
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

export const StakeAssetDialog: React.FC<IDialogProps> = ({ name, isOpen, data, closeDialog }) => {
    const { submitTx, isSuccess, isLoading, error } = useModal('stake-asset-dialog');
    const [amount, setAmount] = useMediatedState(inputMediator, '');
    const [isMax, setIsMax] = React.useState(false);

    const handleSubmit = async () => {
        await submitTx();
    };

    return (
        data &&
        data.asset && (
            <>
                <ModalHeader dialog="stake-asset-dialog" tabs={[`${name}`]} asset={data.asset} />
                {!isSuccess && !error ? (
                    // Default State
                    <>
                        <h3 className="mt-5 text-neutral400">Amount</h3>
                        <CoinInput
                            amount={amount}
                            setAmount={setAmount}
                            coin={{
                                logo: data.logo,
                                name: data.asset,
                            }}
                            balance={'0.23'}
                            isMax={isMax}
                            setIsMax={setIsMax}
                        />

                        <ModalTableDisplay
                            title="Transaction Overview"
                            content={[
                                {
                                    label: 'Supply APR (%)',
                                    value: `${0.44}%`,
                                },
                                {
                                    label: 'Collateralization',
                                    value: <ActiveStatus active={true} size="sm" />,
                                },
                                {
                                    label: 'Insurance',
                                    value: <ActiveStatus active={false} size="sm" />,
                                },
                            ]}
                        />
                    </>
                ) : (
                    <div className="mt-10 mb-8">
                        <TransactionStatus success={isSuccess} errorText={error} full />
                    </div>
                )}

                <ModalFooter>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <FaGasPump />
                            <span>Gas Limit</span>
                        </div>
                        <div>
                            <DefaultDropdown
                                items={[{ text: 'Normal' }, { text: 'Low' }, { text: 'High' }]}
                            />
                        </div>
                    </div>
                    <div>
                        <Button
                            disabled={isSuccess}
                            onClick={handleSubmit as any}
                            loading={isLoading}
                        >
                            Submit Transaction
                        </Button>
                    </div>
                </ModalFooter>
            </>
        )
    );
};
