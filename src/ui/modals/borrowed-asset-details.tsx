import React from 'react';
import { MdCompareArrows, MdOutlineArrowForward } from 'react-icons/md';
import { Button } from '../components/buttons';
import { TransactionStatus } from '../components/statuses';
import { AssetDisplay } from '../components/displays';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '../../store/contexts';
import { IDialogProps } from '.';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../modals/subcomponents';
import { useModal } from '../../hooks/ui';

export const BorrowedAssetDetailsDialog: React.FC<IDialogProps> = ({
    name,
    isOpen,
    data,
    closeDialog,
}) => {
    const navigate = useNavigate();
    const { updateTranche, setAsset } = useSelectedTrancheContext();
    const { isSuccess, submitTx, isLoading } = useModal('borrowed-asset-details-dialog');

    const routeToTranche = (row: any) => {
        setAsset(row.asset);
        updateTranche('id', row.trancheId);
        closeDialog('borrowed-asset-details-dialog');
        navigate(`/tranches/${row.tranche.replace(/\s+/g, '-')}`, { state: { view: 'details' } });
    };

    const handleSubmit = async () => {
        await submitTx();
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

                <ModalFooter between>
                    <Button label="View Tranche" onClick={() => routeToTranche(data)} />
                    <Button
                        onClick={handleSubmit}
                        primary
                        label="Repay Loan"
                        icon={<MdOutlineArrowForward />}
                        loading={isLoading}
                    />
                </ModalFooter>
            </>
        )
    );
};
