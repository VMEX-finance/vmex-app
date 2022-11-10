import React from 'react';
import { MdCompareArrows, MdOutlineArrowForward } from 'react-icons/md';
import { Button } from '../../components/buttons';
import { TransactionStatus } from '../../components/statuses';
import { AssetDisplay } from '../../components/displays';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext, useTransactionsContext } from '../../../store/contexts';
import { TIMER_CLOSE_DELAY } from '../../../utils/constants';
import { IDialogProps } from '.';
import { ModalHeader, ModalTableDisplay } from '../../components/modals';

export const BorrowedAssetDetailsDialog: React.FC<IDialogProps> = ({
    name,
    isOpen,
    data,
    closeDialog,
}) => {
    const navigate = useNavigate();
    const { updateTranche, setAsset } = useSelectedTrancheContext();
    const { newTransaction } = useTransactionsContext();
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState('');

    const routeToTranche = (tranche: any) => {
        setAsset(tranche.asset);
        updateTranche('id', tranche.id);
        navigate(`/tranches`);
    };

    const handleSubmit = () => {
        setIsSuccess(true);
        newTransaction(
            `0x${Math.floor(Math.random() * 9)}...${Math.floor(Math.random() * 9)}${Math.floor(
                Math.random() * 9,
            )}a`,
        );

        setTimeout(() => {
            setIsSuccess(false);
            closeDialog('borrowed-asset-details-dialog');
        }, TIMER_CLOSE_DELAY);
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
                        <div className="grid grid-cols-3 items-center">
                            <div className="flex flex-col">
                                <AssetDisplay name={data.asset} className="mb-1" />
                                <span>
                                    {130.2} {data.asset} Borrowed
                                </span>
                                <span className="text-sm text-neutral-500">
                                    ${'156,240.02'} USD
                                </span>
                            </div>
                            <MdCompareArrows className="justify-self-center" size="32px" />
                            <div className="flex flex-col">
                                <AssetDisplay
                                    name={'USDC'}
                                    logo={`/tokens/token-${'USDC'}.svg`}
                                    className="mb-1"
                                />
                                <span>
                                    {'156,241.1'} {'USDC'} Collatoralized
                                </span>
                                <span className="text-sm text-neutral-500">
                                    ${'156,240.02'} USD
                                </span>
                            </div>
                        </div>

                        <ModalTableDisplay
                            title="Loan Details"
                            content={[
                                {
                                    label: 'Interest Rate',
                                    value: `${0.44}%`,
                                },
                                {
                                    label: 'Date Borrowed',
                                    value: '12-23-2022 | 13:05',
                                },
                                {
                                    label: 'Interest Accrued',
                                    value: `$${13.56}`,
                                },
                                {
                                    label: 'TX Hash',
                                    value: '0x932...2134',
                                    baseLink: `https://etherscan.com/tx/`,
                                },
                            ]}
                        />

                        <h3 className="mt-6 text-gray-400">Price Analytics</h3>
                        <div className="grid gap-2">
                            <div className="min-h-[100px]"></div>
                        </div>
                    </>
                ) : (
                    <div className="mt-10 mb-8">
                        <TransactionStatus success={isSuccess} full />
                    </div>
                )}

                <div className="mt-5 sm:mt-6 flex justify-between">
                    <Button
                        onClick={handleSubmit}
                        label={
                            <span className="flex items-center gap-2">
                                Repay Loan <MdOutlineArrowForward />
                            </span>
                        }
                    />
                    <Button
                        primary
                        label="View Tranche"
                        onClick={() => routeToTranche(data)}
                        disabled
                    />
                </div>
            </>
        )
    );
};
