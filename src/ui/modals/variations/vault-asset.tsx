import React, { useEffect } from 'react';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useModal, useVault } from '@/hooks';
import { Button, TransactionStatus, CoinInput } from '@/ui/components';
import { VaultDetails } from '@/ui/features/vault-details';
import { VMEX_VEVMEX_CHAINID, getChainId, toSymbol } from '@/utils';
import { useAccount, useSwitchNetwork, useFeeData } from 'wagmi';

export const VaultAssetDialog: React.FC<IDialogProps> = ({ name, isOpen, data, closeDialog }) => {
    const { address } = useAccount();
    const chainId = getChainId();
    const { switchNetworkAsync } = useSwitchNetwork();
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
    const { data: gas } = useFeeData();

    const handleSubmit = async (e: any) => {
        if (chainId !== VMEX_VEVMEX_CHAINID && switchNetworkAsync)
            await switchNetworkAsync(VMEX_VEVMEX_CHAINID);
        if (view === 'Deposit') {
            await handleDeposit(e);
        } else {
            await handleWithdraw(e);
        }
    };

    const renderBtnText = () => {
        if (chainId !== VMEX_VEVMEX_CHAINID) return 'Switch Network';
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
                    {view === 'Deposit' ? (
                        <ModalTableDisplay
                            title="Transaction Overview"
                            content={[
                                {
                                    label: 'Estimated Gas',
                                    value: `${gas?.formatted.gasPrice} gwei`,
                                },
                            ]}
                        />
                    ) : (
                        <ModalTableDisplay
                            title="Transaction Overview"
                            content={[
                                {
                                    label: 'Remaining Supply',
                                    value: `${
                                        Number(data?.vaultDeposited?.normalized || '0') -
                                        Number(amount || '0')
                                    }`,
                                },
                                {
                                    label: 'Estimated Gas',
                                    value: `${gas?.formatted.gasPrice} gwei`,
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
