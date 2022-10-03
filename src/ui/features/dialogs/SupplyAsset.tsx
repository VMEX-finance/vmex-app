import React from 'react';
import { Dialog } from '@headlessui/react';
import { IoIosClose } from 'react-icons/io';
import { PieChart } from 'react-minimal-pie-chart';
import { useMediatedState } from 'react-use';
import { inputMediator } from '../../../utils/helpers';
import { CoinInput } from '../../components/inputs';
import { Button, Checkbox } from '../..//components/buttons';
import { TranchToggle } from '../../components/toggles';
import { TransactionStatus } from '../../components/statuses';

interface IOwnedAssetDetails {
    name?: string;
    isOpen?: boolean;
    data?: any;
    closeDialog(e: any): void;
}

export const SupplyAssetDialog: React.FC<IOwnedAssetDetails> = ({
    name,
    isOpen,
    data,
    closeDialog,
}) => {
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [asCollateral, setAsCollateral] = React.useState(false);
    const [isInsured, setIsInsured] = React.useState(false);

    const [amount, setAmount] = useMediatedState(inputMediator, '');
    const [t0, setT0] = React.useState(0);
    const [t1, setT1] = React.useState(0);
    const [t2, setT2] = React.useState(0);

    return (
        data.tranches && (
            <>
                <div className="flex flex-row justify-between">
                    <div className="mt-3 text-left sm:mt-5">
                        <Dialog.Title
                            as="h3"
                            className="text-xl leading-6 font-medium text-gray-900"
                        >
                            {name} {data.asset}
                        </Dialog.Title>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Please be aware when lending an asset...
                            </p>
                        </div>
                    </div>
                    <div
                        className="self-baseline h-fit w-fit cursor-pointer text-neutral-900 hover:text-neutral-600 transition duration-200"
                        onClick={() => closeDialog('loan-asset-dialog')}
                    >
                        <IoIosClose className="w-7 h-7" />
                    </div>
                </div>
                {!isSuccess && !isError ? (
                    // Default State
                    <>
                        <h3 className="mt-5 text-gray-400">Amount</h3>
                        <CoinInput
                            amount={amount}
                            setAmount={setAmount}
                            coin={{
                                logo: data.logo,
                                name: data.asset,
                            }}
                            balance={'0.23'}
                        />

                        <div className="mt-1">
                            <Checkbox
                                setChecked={setIsInsured}
                                checked={isInsured}
                                label="Insure Asset"
                            />
                            <Checkbox
                                setChecked={setAsCollateral}
                                checked={asCollateral}
                                label="Collateralize Asset"
                            />
                        </div>

                        <h3 className="mt-6 text-gray-400">Risk Profile Selection</h3>
                        <div className="w-full flex flex-row justify-between items-center mt-1 p-2">
                            <PieChart
                                data={[
                                    { title: 'Tranch 0', value: Number(t0), color: '#000000' },
                                    { title: 'Tranch 1', value: Number(t1), color: '#90E7D4' },
                                    { title: 'Tranch 2', value: Number(t2), color: '#F35B53' },
                                ]}
                                className="w-[150px] h-[150px]"
                                animate
                                lineWidth={50}
                                center={[60, 60]}
                                viewBoxSize={[120, 120]}
                                label={({ dataEntry, dataIndex }) => {
                                    return dataEntry.percentage > 0 ? `T${dataIndex}` : ``;
                                }}
                                labelPosition={100 - 50 / 2}
                                labelStyle={{
                                    fill: '#fff',
                                    opacity: 1,
                                    pointerEvents: 'none',
                                    fontSize: '10px',
                                }}
                            />
                            <div className="flex flex-col grow">
                                <TranchToggle
                                    max={1 - Number(t1) + Number(t2)}
                                    name="Stable Asset Tranche"
                                    value={t0}
                                    onChange={(e: any) => setT0(e.target.value)}
                                    disabled={data.tranches[0].disabled}
                                />
                                <TranchToggle
                                    max={1 - Number(t0) + Number(t2)}
                                    name="High Cap Tranche"
                                    value={t1}
                                    onChange={(e: any) => setT1(e.target.value)}
                                    disabled={data.tranches[1].disabled}
                                />
                                <TranchToggle
                                    max={1 - Number(t1) + Number(t0)}
                                    name="Low Cap Tranche"
                                    value={t2}
                                    onChange={(e: any) => setT2(e.target.value)}
                                    disabled={data.tranches[2].disabled}
                                />
                            </div>
                        </div>
                    </>
                ) : isSuccess ? (
                    // Success State
                    <div className="mt-10 mb-8">
                        <TransactionStatus success={true} full />
                    </div>
                ) : (
                    // Error State
                    <div className="mt-10 mb-8">
                        <TransactionStatus success={false} full />
                    </div>
                )}
                <div className="mt-5 sm:mt-6">
                    <Button
                        disabled={isSuccess || isError}
                        onClick={() => {
                            setIsSuccess(true);

                            setTimeout(() => {
                                setIsSuccess(false);
                                closeDialog('loan-asset-dialog');
                            }, 2000);
                        }}
                        label={'Submit Transaction'}
                    />
                </div>
            </>
        )
    );
};
