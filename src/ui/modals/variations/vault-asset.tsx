import React, { useEffect } from 'react';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useModal, useVault } from '@/hooks';
import { Button, TransactionStatus, CoinInput } from '@/ui/components';
import { VaultDetails } from '@/ui/features/vault-details';
import { VMEX_VEVMEX_CHAINID, getChainId, toSymbol } from '@/utils';
import { useAccount, useSwitchNetwork, useFeeData } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '@/store';

export const VaultAssetDialog: React.FC<IDialogProps> = ({ name, isOpen, data, closeDialog }) => {
    const { address } = useAccount();
    const navigate = useNavigate();
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
        underlying,
    } = useVault(data?.vaultAddress, data?.gaugeAddress, data?.vaultSymbol);
    const { data: gas } = useFeeData();
    const { updateTranche, setAsset } = useSelectedTrancheContext();

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

    const route = (
        e: Event,
        symbol?: string,
        trancheId?: string | number,
        trancheName?: string,
    ) => {
        e.stopPropagation();
        if (!trancheId || !trancheName || !symbol) return;
        setAsset(symbol);
        updateTranche('id', trancheId.toString());
        closeDialog && closeDialog('vault-asset-dialog');
        navigate(`/tranches/${trancheName.replace(/\s+/g, '-')?.toLowerCase()}`, {
            state: { view, trancheId: trancheId.toString() },
        });
    };

    useEffect(() => {
        if (data?.tab) setView(data?.tab);
    }, []);
    console.log('Data in Modal:', data);
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
                            name: data.vaultSymbol,
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

            <ModalFooter between>
                <Button
                    type="outline"
                    onClick={(e: any) =>
                        route(e, underlying?.symbol, underlying?.trancheId, underlying?.trancheName)
                    }
                >
                    Deposit {underlying?.symbol}
                </Button>
                <Button
                    disabled={isSuccess}
                    onClick={handleSubmit}
                    loading={
                        isLoading || loading.deposit || loading.depositApprove || loading.withdraw
                    }
                    type="accent"
                >
                    {renderBtnText()}
                </Button>
            </ModalFooter>
        </>
    );
};
