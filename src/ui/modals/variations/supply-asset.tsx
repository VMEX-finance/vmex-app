import React, { useEffect } from 'react';
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
import { useTrancheMarketsData } from '../../../api';

interface IOwnedAssetDetails {
    name?: string;
    isOpen?: boolean;
    data?: any;
    tab?: string;
    closeDialog(e: any): void;
}

export const SupplyAssetDialog: React.FC<IOwnedAssetDetails> = ({ name, data, tab }) => {
    const { submitTx, isSuccess, error, isLoading } = useModal('loan-asset-dialog');
    const [view, setView] = React.useState('Supply');
    const [asCollateral, setAsCollateral] = React.useState(true);
    const [amount, setAmount] = useMediatedState(inputMediator, '');
    const { getTrancheMarket } = useTrancheMarketsData(data?.trancheId);
    console.log(data);
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

    useEffect(() => {
        if (data?.view) setView('Withdraw');
    }, [data?.view]);

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
                            onClick={Number(data.amountWithdrawOrRepay) !== 0 ? setView : () => {}}
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
                                        logo: `/coins/${data.asset?.toLowerCase()}.svg`,
                                        name: data.asset,
                                    }}
                                    balance={data?.amount?.replaceAll(',', '')}
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
                                <HealthFactor asset={data.asset} amount={amount} type={'supply'} />

                                <ModalTableDisplay
                                    title="Transaction Overview"
                                    content={[
                                        {
                                            label: 'Supply APR (%)',
                                            value: `${data.apy}%`,
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
                            onClick={data?.view ? () => {} : setView}
                        />
                        {!isSuccess && !error ? (
                            // Default State
                            <>
                                <h3 className="mt-5 text-gray-400">Amount</h3>
                                <CoinInput
                                    amount={amount}
                                    setAmount={setAmount}
                                    coin={{
                                        logo: `/coins/${data.asset?.toLowerCase()}.svg`,
                                        name: data.asset,
                                    }}
                                    balance={
                                        data.amountWithdrawOrRepay?.replaceAll(',', '') ||
                                        data.amountNative?.replaceAll(',', '')
                                    }
                                />
                                <h3 className="mt-6 text-gray-400">Health Factor</h3>
                                <HealthFactor
                                    asset={data.asset}
                                    amount={amount}
                                    type={'withdraw'}
                                />

                                <ModalTableDisplay
                                    title="Transaction Overview"
                                    content={[
                                        {
                                            label: 'Remaining Supply',
                                            value: `${getTrancheMarket(data.asset).supplyTotal}`, // TODO: denominate this in native amount
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
                        disabled={isSuccess || error.length !== 0 || !amount}
                        onClick={handleSubmit}
                        label={'Submit Transaction'}
                        loading={isLoading}
                    />
                </ModalFooter>
            </>
        )
    );
};
