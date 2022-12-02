import React from 'react';
import { useMediatedState } from 'react-use';
import { inputMediator, convertNativeTokenStringToNumber } from '../../../utils/helpers';
import { CoinInput } from '../../components/inputs';
import { Button } from '../../components/buttons';
import { BasicToggle } from '../../components/toggles';
import { ActiveStatus, TransactionStatus } from '../../components/statuses';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useModal } from '../../../hooks/ui';
import { supply } from '@vmex/sdk';
import { MAINNET_ASSET_MAPPINGS, NETWORK } from '../../../utils/sdk-helpers';

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
    const { submitTx, isSuccess, error, isLoading } = useModal('loan-asset-dialog');

    const [view, setView] = React.useState('Supply');
    const [asCollateral, setAsCollateral] = React.useState(true);
    const [amount, setAmount] = useMediatedState(inputMediator, '');

    const handleSubmit = async () => {
        await submitTx(async () => {
            await supply({
                underlying: MAINNET_ASSET_MAPPINGS.get(data.asset) || '',
                trancheId: data.tranche,
                amount: convertNativeTokenStringToNumber(amount),
                signer: data.signer,
                network: NETWORK,
                // referrer: number,
                // collateral: boolean,
                // test: boolean
            });
        });
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
                        {!isSuccess && !error ? (
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
                                    balance={data.amount}
                                />

                                <h3 className="mt-6 text-gray-400">Collaterize</h3>
                                <div className="mt-1">
                                    <BasicToggle
                                        checked={asCollateral}
                                        onChange={() => setAsCollateral(!asCollateral)}
                                        disabled={!data.canBeCollat}
                                    />
                                </div>

                                <ModalTableDisplay
                                    title="Transaction Overview"
                                    content={[
                                        {
                                            label: 'Supply APR (%)',
                                            value: `${data.apy_perc}%`,
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
                        {!isSuccess && !error ? (
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
                <ModalFooter>
                    <Button
                        primary
                        disabled={isSuccess || error.length !== 0}
                        onClick={handleSubmit}
                        label={'Submit Transaction'}
                        loading={isLoading}
                    />
                </ModalFooter>
            </>
        )
    );
};
