import React from 'react';
import { MdOutlineArrowForward } from 'react-icons/md';
import { Button } from '../../components/buttons';
import { ActiveStatus, TransactionStatus } from '../../components/statuses';
import { AssetDisplay, NumberAndDollar } from '../../components/displays';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../../modals/subcomponents';
import { IDialogProps } from '../utils';
import { useModal } from '../../../hooks/ui';
import { CoinInput } from '../../components/inputs';
import { useMediatedState } from 'react-use';
import { inputMediator, convertStringFormatToNumber } from '../../../utils/helpers';
import { MAINNET_ASSET_MAPPINGS, NETWORK } from '../../../utils/sdk-helpers';
import { withdraw } from '@vmex/sdk';

export const SuppliedAssetDetailsDialog: React.FC<IDialogProps> = ({ name, data, closeDialog }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { updateTranche, setAsset } = useSelectedTrancheContext();
    const { submitTx, isSuccess, isLoading } = useModal('supplied-asset-details-dialog');
    const [amount, setAmount] = useMediatedState(inputMediator, '');

    const routeToTranche = (row: any) => {
        setAsset(row.asset);
        updateTranche('id', row.trancheId);
        closeDialog('supplied-asset-details-dialog');
        navigate(`/tranches/${row.tranche.replace(/\s+/g, '-')}`, { state: { view: 'details' } });
    };

    const handleSubmit = async () => {
        await submitTx(async () => {
            await withdraw({
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
                <ModalHeader title={name} dialog="supplied-asset-details-dialog" />
                {!isSuccess ? (
                    // Default State
                    <>
                        <h3 className="mt-5 text-gray-400">Overview</h3>
                        <div className="flex flex-col">
                            <AssetDisplay
                                name={data.asset}
                                logo={`/coins/${data.asset?.toLowerCase()}.svg`}
                                className="mb-1"
                            />
                            <NumberAndDollar
                                value={`${data.amountNative} Supplied`}
                                dollar={`${data.amount} USD`}
                                size="sm"
                                color="text-black"
                            />
                        </div>

                        <ModalTableDisplay
                            title="Staking Details"
                            content={[
                                {
                                    label: 'Collateral',
                                    value: <ActiveStatus active={data.collateral} />,
                                },
                                {
                                    label: 'Interest Rate',
                                    value: `${data.apy}%`,
                                },
                                {
                                    label: 'Interest Accrued',
                                    value: `$${13.56}`, // TODO: add true sum of interest accrued in USD
                                },
                            ]}
                        />

                        <h3 className="mt-5 text-gray-400">Withdraw Amount</h3>
                        <CoinInput
                            amount={amount}
                            setAmount={setAmount}
                            coin={{
                                logo: `/coins/${data.asset?.toLowerCase()}.svg`,
                                name: data.asset,
                            }}
                            balance={data.amountNative}
                        />
                    </>
                ) : (
                    <div className="mt-10 mb-8">
                        <TransactionStatus success={isSuccess} full />
                    </div>
                )}
                <ModalFooter between>
                    {!pathname.includes('/tranches') ? (
                        <Button label="View Tranche" onClick={() => routeToTranche(data)} />
                    ) : (
                        <div></div>
                    )}
                    <Button
                        primary
                        onClick={handleSubmit}
                        label={'Withdraw'}
                        icon={<MdOutlineArrowForward />}
                        loading={isLoading}
                        disabled={!amount}
                    />
                </ModalFooter>
            </>
        )
    );
};
