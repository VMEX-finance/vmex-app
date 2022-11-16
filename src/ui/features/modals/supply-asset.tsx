import React from 'react';
import { useMediatedState } from 'react-use';
import { inputMediator } from '../../../utils/helpers';
import { CoinInput } from '../../components/inputs';
import { Button } from '../../components/buttons';
import { BasicToggle } from '../../components/toggles';
import { ActiveStatus, TransactionStatus } from '../../components/statuses';
import { useTransactionsContext } from '../../../store/contexts';
import { TIMER_CLOSE_DELAY } from '../../../utils/constants';
import { ModalHeader, ModalTableDisplay } from '../../components/modals';
import { useEffect, useState } from 'react';
import { AppTemplate, GridView } from '../../templates';
import { TrancheTVLDataCard, TrancheInfoCard, TrancheStatisticsCard } from '../tranche';
import { Card } from '../../components/cards';
import { TrancheTable } from '../../tables';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { _mockTranchesData } from '../../../utils/mock-data';
import { useWalletState } from '../../../hooks/wallet';
import { useSupplyContext } from '../../../store/contexts';

interface IOwnedAssetDetails {
    name?: string;
    isOpen?: boolean;
    data?: any;
    tab?: string;
    closeDialog(e: any): void;
}

export const SupplyAssetDialog: React.FC<IOwnedAssetDetails> = ({
    name,
    isOpen,
    data,
    tab,
    closeDialog,
}) => {
    const [view, setView] = React.useState('Supply');

    const { newTransaction } = useTransactionsContext();

    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [asCollateral, setAsCollateral] = React.useState(false);
    const [amount, setAmount] = useMediatedState(inputMediator, '');

    const handleSubmit = () => {
        setIsSuccess(true);
        newTransaction(
            `0x${Math.floor(Math.random() * 9)}...${Math.floor(Math.random() * 9)}${Math.floor(
                Math.random() * 9,
            )}p`,
        );

        setTimeout(() => {
            setIsSuccess(false);
            closeDialog('loan-asset-dialog');
        }, TIMER_CLOSE_DELAY);
    };

    return (
        data &&
        data.asset && (
            <>
                {view?.includes('Supply') ? (
                    <>
                        <ModalHeader
                            dialog="loan-asset-dialog"
                            title={name}
                            asset={data.asset}
                            tab={tab}
                            onClick={setView}
                            primary
                        />
                        {!isSuccess && !isError ? (
                            // Default State
                            <>
                                <h3 className="mt-5 text-gray-400">Amount</h3>
                                <CoinInput
                                    amount={amount}
                                    setAmount={setAmount}
                                    coin={{
                                        logo: `/tokens/token-${data.asset}.svg`,
                                        name: data.asset,
                                    }}
                                    balance={'0.23'}
                                />

                                <h3 className="mt-6 text-gray-400">Collaterize</h3>
                                <div className="mt-1">
                                    <BasicToggle
                                        checked={asCollateral}
                                        onChange={() => setAsCollateral(!asCollateral)}
                                    />
                                </div>

                                <ModalTableDisplay
                                    title="Transaction Overview"
                                    content={[
                                        {
                                            label: 'Supply APR (%)',
                                            value: `${0.44}%`,
                                        },
                                        {
                                            label: 'Collateralization',
                                            value: <ActiveStatus active={asCollateral} size="sm" />,
                                        },
                                    ]}
                                />
                            </>
                        ) : (
                            <div className="mt-10 mb-8">
                                <TransactionStatus success={isSuccess} full />
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <ModalHeader
                            dialog="loan-asset-dialog"
                            title={name}
                            asset={data.asset}
                            tab={tab}
                            onClick={setView}
                        />
                        {!isSuccess && !isError ? (
                            // Default State
                            <>
                                <h3 className="mt-5 text-gray-400">Amount</h3>
                                <CoinInput
                                    amount={amount}
                                    setAmount={setAmount}
                                    coin={{
                                        logo: `/tokens/token-${data.asset}.svg`,
                                        name: data.asset,
                                    }}
                                    balance={'0.23'}
                                />

                                <ModalTableDisplay
                                    title="Transaction Overview"
                                    content={[
                                        {
                                            label: 'Supply APR (%)',
                                            value: `${0.44}%`,
                                        },
                                        {
                                            label: 'Remaining Supply',
                                            value: `${0.0}`,
                                        },
                                    ]}
                                />
                            </>
                        ) : (
                            <div className="mt-10 mb-8">
                                <TransactionStatus success={isSuccess} full />
                            </div>
                        )}
                    </>
                )}
                <div className="mt-5 sm:mt-6">
                    <Button
                        disabled={isSuccess || isError}
                        onClick={handleSubmit}
                        label={'Submit Transaction'}
                    />
                </div>
            </>
        )
    );
};
