import React from 'react';
import { Dialog } from '@headlessui/react';
import { IoIosClose } from 'react-icons/io';
import { MdOutlineArrowForward } from 'react-icons/md';
import { useMediatedState } from 'react-use';
import { Button } from '../../components/buttons';
import { TransactionStatus } from '../../components/statuses';
import { AssetDisplay } from '../../components/displays';
import { inputMediator } from '../../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext, useTransactionsContext } from '../../../store/contexts';

interface IOwnedAssetDetails {
    name?: string;
    isOpen?: boolean;
    data?: any;
    closeDialog(e: any): void;
}

export const SuppliedAssetDetailsDialog: React.FC<IOwnedAssetDetails> = ({
    name,
    isOpen,
    data,
    closeDialog,
}) => {
    const navigate = useNavigate();
    const { updateTranche, setAsset } = useSelectedTrancheContext();
    const { newTransaction } = useTransactionsContext();
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isError, setIsError] = React.useState(false);

    const [amount, setAmount] = useMediatedState(inputMediator, '');

    const routeToTranche = (tranche: any) => {
        setAsset(tranche.asset);
        updateTranche('id', tranche.id);
        navigate(`/tranches`);
    };

    return (
        data.tranches && (
            <>
                <div className="flex flex-row justify-between">
                    <div className="mt-3 text-left sm:mt-5">
                        <Dialog.Title
                            as="h3"
                            className="text-xl leading-6 font-medium text-gray-900"
                        >
                            {name}
                        </Dialog.Title>
                    </div>
                    <div
                        className="self-baseline h-fit w-fit cursor-pointer text-neutral-900 hover:text-neutral-600 transition duration-200"
                        onClick={() => closeDialog('supplied-asset-details-dialog')}
                    >
                        <IoIosClose className="w-7 h-7" />
                    </div>
                </div>
                {!isSuccess && !isError ? (
                    // Default State
                    <>
                        <h3 className="mt-5 text-gray-400">Overview</h3>
                        <div className="flex flex-col">
                            <AssetDisplay
                                name={data.asset}
                                logo={`/tokens/token-${data.asset.toUpperCase()}.svg`}
                                className="mb-1"
                            />
                            <span>
                                {130.2} {data.asset.toUpperCase()} Supplied
                            </span>
                            <span className="text-sm text-neutral-500">${'156,240.02'} USD</span>
                        </div>

                        <h3 className="mt-6 text-gray-400">Staking Details</h3>
                        <div
                            className={`mt-2 flex justify-between rounded-lg border border-neutral-900 p-4 lg:py-6`}
                        >
                            <div className="flex flex-col gap-2">
                                <span>Interest Rate</span>
                                <span>Date Supplied</span>
                                <span>Interest Accrued</span>
                                <span>TX Hash</span>
                            </div>

                            <div className="min-w-[100px] flex flex-col gap-2">
                                <span>{0.44}%</span>
                                <span>12-23-2022 | 13:05</span>
                                <span>${13.56}</span>
                                <span className="underline text-brand-purple cursor-pointer">
                                    <a href="/borrowing">{'0x932...2134'}</a>
                                </span>
                            </div>
                        </div>

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
                {/* TODO: implement appropriate data type so we can pass tranche id to "routeToTranche" */}
                <div className="mt-5 sm:mt-6 flex justify-between">
                    <Button
                        onClick={() => {
                            setIsSuccess(true);
                            newTransaction(
                                `0x${Math.floor(Math.random() * 9)}...${Math.floor(
                                    Math.random() * 9,
                                )}${Math.floor(Math.random() * 9)}z`,
                            );

                            setTimeout(() => {
                                setIsSuccess(false);
                                closeDialog('supplied-asset-details-dialog');
                            }, 2000);
                        }}
                        label={
                            <span className="flex items-center gap-2">
                                Withdraw <MdOutlineArrowForward />
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
