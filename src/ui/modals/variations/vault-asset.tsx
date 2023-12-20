import React, { useEffect } from 'react';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useModal, useVault } from '@/hooks';
import { Button, TransactionStatus, CoinInput } from '@/ui/components';
import { VaultDetails } from '@/ui/features/vault-details';
import { convertAddressToSymbol } from '@vmexfinance/sdk';
import { getNetworkName, toSymbol } from '@/utils';
import { useAccount, useBalance } from 'wagmi';

export const VaultAssetDialog: React.FC<IDialogProps> = ({ name, isOpen, data, closeDialog }) => {
    const { address } = useAccount();
    const { submitTx, isSuccess, isLoading, error, view, setView } = useModal('vault-asset-dialog');
    const {
        amount,
        setAmount,
        isMax,
        setIsMax,
        handleDeposit,
        handleWithdraw,
        approvedEnough,
        loading,
        vaultBalance,
        gaugeBalance,
    } = useVault(data?.vaultAddress, data?.gaugeAddress);

    const handleSubmit = async (e: any) => {
        if (view === 'Deposit') {
            await handleDeposit(e);
        } else {
            await handleWithdraw(e);
        }
    };

    const renderBtnText = () => {
        if (view === 'Deposit') {
            if (approvedEnough()) {
                return 'Deposit';
            }
            return 'Approve';
        }
        return 'Withdraw';
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
                    <h3 className="mt-3 text-neutral400">Vault Details</h3>
                    <VaultDetails vault={data} deposited={gaugeBalance?.formatted} />
                    <h3 className="mt-3 text-neutral400">Amount</h3>
                    <CoinInput
                        amount={amount}
                        setAmount={setAmount}
                        coin={{
                            logo: data.vaultIcon,
                            name:
                                view === 'Deposit'
                                    ? toSymbol(data?.vaultAddress) || 'VMEX'
                                    : data.vaultSymbol,
                        }}
                        balance={
                            (view === 'Deposit'
                                ? vaultBalance?.formatted
                                : gaugeBalance?.formatted) || '0.0'
                        }
                        isMax={isMax}
                        setIsMax={setIsMax}
                    />
                    {/* {view === 'Deposit' ? (
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
                    )} */}
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
                        onClick={handleSubmit}
                        loading={
                            isLoading ||
                            loading.deposit ||
                            loading.depositApprove ||
                            loading.withdraw
                        }
                        type="accent"
                    >
                        {renderBtnText()}
                    </Button>
                </div>
            </ModalFooter>
        </>
    );
};
