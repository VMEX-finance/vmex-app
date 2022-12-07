import React from 'react';
import { MdCompareArrows, MdOutlineArrowForward } from 'react-icons/md';
import { Button } from '../../components/buttons';
import { TransactionStatus } from '../../components/statuses';
import { AssetDisplay, NumberAndDollar } from '../../components/displays';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../../modals/subcomponents';
import { useModal } from '../../../hooks/ui';
import { MAINNET_ASSET_MAPPINGS, NETWORK } from '../../../utils/sdk-helpers';
import { convertStringFormatToNumber, inputMediator } from '../../../utils/helpers';
import { useMediatedState } from 'react-use';
import { repay } from '@vmex/sdk';
import { CoinInput } from '../../components/inputs';

export const BorrowedAssetDetailsDialog: React.FC<IDialogProps> = ({
    name,
    isOpen,
    data,
    closeDialog,
}) => {
    console.log(data);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { updateTranche, setAsset } = useSelectedTrancheContext();
    const { isSuccess, submitTx, isLoading } = useModal('borrowed-asset-details-dialog');
    const [amount, setAmount] = useMediatedState(inputMediator, '');

    const routeToTranche = (row: any) => {
        setAsset(row.asset);
        updateTranche('id', row.trancheId);
        closeDialog('borrowed-asset-details-dialog');
        navigate(`/tranches/${row.tranche.replace(/\s+/g, '-')}`, { state: { view: 'details' } });
    };

    const handleSubmit = async () => {
        await submitTx(async () => {
            await repay({
                asset: MAINNET_ASSET_MAPPINGS.get(data.asset) || '',
                trancheId: data.tranche,
                amount: convertStringFormatToNumber(amount),
                rateMode: 2,
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
                <ModalHeader title={name} dialog="borrowed-asset-details-dialog" />
                {!isSuccess ? (
                    // Default State
                    <>
                        <h3 className="mt-5 text-gray-400">Overview</h3>
                        <div className="grid grid-cols-1 items-center">
                            <div className="flex flex-col">
                                <AssetDisplay name={data.asset} className="mb-1" />
                                <NumberAndDollar
                                    value={`${data.amountNative} Accrued Debt`}
                                    dollar={`${data.amount} USD`}
                                    size="sm"
                                    color="text-black"
                                />
                            </div>
                        </div>

                        <ModalTableDisplay
                            title="Loan Details"
                            content={[
                                {
                                    label: 'Interest Rate',
                                    value: `${data.apy}%`,
                                },
                            ]}
                        />

                        <h3 className="mt-5 text-gray-400">Repay Amount</h3>
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
                        onClick={handleSubmit}
                        primary
                        label="Repay Loan"
                        icon={<MdOutlineArrowForward />}
                        loading={isLoading}
                        disabled={!amount}
                    />
                </ModalFooter>
            </>
        )
    );
};
