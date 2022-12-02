import React from 'react';
import { useMediatedState } from 'react-use';
import { inputMediator, convertStringFormatToNumber } from '../../../utils/helpers';
import { CoinInput } from '../../components/inputs';
import { Button } from '../../components/buttons';
import { BasicToggle } from '../../components/toggles';
import { ActiveStatus, TransactionStatus } from '../../components/statuses';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useModal } from '../../../hooks/ui';
import { supply, withdraw } from '@vmex/sdk';
import { MAINNET_ASSET_MAPPINGS, NETWORK } from '../../../utils/sdk-helpers';
import { HealthFactor } from '../../components/displays';

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
            view?.includes('Supply')
                ? await supply({
                      underlying: MAINNET_ASSET_MAPPINGS.get(data.asset) || '',
                      trancheId: data.tranche,
                      amount: convertStringFormatToNumber(amount),
                      signer: data.signer,
                      network: NETWORK,
                      collateral: asCollateral,
                      // referrer: number,
                      // collateral: boolean,
                      // test: boolean
                  })
                : await withdraw({
                      asset: MAINNET_ASSET_MAPPINGS.get(data.asset) || '',
                      trancheId: data.tranche,
                      amount: convertStringFormatToNumber(amount),
                      signer: data.signer,
                      network: NETWORK,
                      interestRateMode: 2,
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

                                <h3 className="mt-6 text-gray-400">Health Factor</h3>
                                <HealthFactor liquidation={1.0} value={1.24} />

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
                                    balance={data.amountWithdrawOrRepay}
                                />
                                <h3 className="mt-6 text-gray-400">Health Factor</h3>
                                <HealthFactor liquidation={1.0} value={1.24} />

                                <ModalTableDisplay
                                    title="Transaction Overview"
                                    content={[
                                        {
                                            label: 'Remaining Supply',
                                            value: `${
                                                parseFloat(
                                                    convertStringFormatToNumber(
                                                        data.amountWithdrawOrRepay,
                                                    ),
                                                ) - parseFloat(convertStringFormatToNumber(amount))
                                            } ${data.asset}`,
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
