import React, { useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { IoIosClose } from 'react-icons/io';
import { TransactionStatus } from '../../components/statuses';
import { Button, DropdownButton } from '../../components/buttons';
import { TIMER_CLOSE_DELAY } from '../../../utils/constants';
import { useMyTranchesContext, useTransactionsContext } from '../../../store/contexts';
import { DefaultInput, ListInput } from '../../../ui/components/inputs';

interface IDialogProps {
    name?: string;
    data?: any;
    closeDialog(e: any): void;
}

export const MyTranchesDialog: React.FC<IDialogProps> = ({ name, data, closeDialog }) => {
    const { newTransaction } = useTransactionsContext();
    const { updateTranche, myTranches, deleteTranche } = useMyTranchesContext();
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isError, setIsError] = React.useState(false);

    const [selectedTranche, setSelectedTranche] = React.useState(
        myTranches.length > 0
            ? myTranches[0]
            : { id: 0, name: '', whitelisted: [], blacklisted: [], tokens: [] },
    );
    const findSelectedTranche = (name: string) => {
        const found = myTranches.find((el) => el.name === name);
        setSelectedTranche(found as any);
    };

    const [_name, setName] = React.useState(selectedTranche.name);
    const [_whitelisted, setWhitelisted] = React.useState(selectedTranche.whitelisted);
    const [_blackListed, setBlackListed] = React.useState(selectedTranche.blacklisted);
    const [_tokens, setTokens] = React.useState(selectedTranche.tokens);

    useEffect(() => {
        setName(selectedTranche.name);
        setWhitelisted(selectedTranche.whitelisted);
        setBlackListed(selectedTranche.blacklisted);
        setTokens(selectedTranche.tokens);
    }, [selectedTranche]);

    return (
        <>
            <div className="flex flex-row justify-between">
                <div className="mt-3 text-left sm:mt-5">
                    <Dialog.Title as="h3" className="text-xl leading-6 font-medium text-gray-900">
                        {name}
                    </Dialog.Title>
                </div>
                <div
                    className="self-baseline h-fit w-fit cursor-pointer text-neutral-900 hover:text-neutral-600 transition duration-200"
                    onClick={() => closeDialog('my-tranches-dialog')}
                >
                    <IoIosClose className="w-7 h-7" />
                </div>
            </div>
            {!isSuccess && !isError ? (
                // Default State
                <>
                    {/* TODO: implement dropdown to choose from myTranches context */}
                    <div className="w-full mt-6">
                        <DropdownButton
                            items={myTranches.map((obj) => ({ ...obj, text: obj.name }))}
                            selected={selectedTranche.name}
                            setSelected={(e: string) => findSelectedTranche(e)}
                            direction="right"
                            size="lg"
                            primary
                            full
                        />
                    </div>
                    <h3 className="mt-2 mb-1 text-gray-400">Name</h3>
                    <DefaultInput
                        value={_name}
                        onType={setName}
                        size="2xl"
                        placeholder="VMEX High Quality..."
                    />
                    <ListInput
                        title="Whitelisted"
                        list={_whitelisted}
                        setList={setWhitelisted}
                        placeholder="0x..."
                    />
                    <ListInput
                        title="Blacklisted"
                        list={_blackListed}
                        setList={setBlackListed}
                        placeholder="0x..."
                    />
                    <ListInput
                        title="Tokens"
                        list={_tokens}
                        setList={setTokens}
                        placeholder="USDC"
                        coin
                    />
                </>
            ) : (
                <div className="mt-10 mb-8">
                    <TransactionStatus success={isSuccess} full />
                </div>
            )}

            <div className="mt-5 sm:mt-6 flex justify-end items-end">
                <div className="flex gap-3">
                    <Button
                        disabled={isSuccess || isError}
                        onClick={() => {
                            deleteTranche(selectedTranche.id);
                            setIsSuccess(true);
                            newTransaction(
                                `0x${Math.floor(Math.random() * 9)}...${Math.floor(
                                    Math.random() * 9,
                                )}${Math.floor(Math.random() * 9)}s`,
                            );

                            setTimeout(() => {
                                setIsSuccess(false);
                                closeDialog('my-tranches-dialog');
                            }, TIMER_CLOSE_DELAY);
                        }}
                        label="Delete"
                        className="!bg-red-600 !text-white !border-red-600 hover:!bg-red-500 hover:!border-red-500 disabled:!text-white"
                    />
                    <Button
                        disabled={isSuccess || isError}
                        onClick={() => {
                            setIsSuccess(true);
                            updateTranche({
                                id: selectedTranche.id,
                                name: _name,
                                whitelisted: _whitelisted,
                                blacklisted: _blackListed,
                                tokens: _tokens,
                            });
                            newTransaction(
                                `0x${Math.floor(Math.random() * 9)}...${Math.floor(
                                    Math.random() * 9,
                                )}${Math.floor(Math.random() * 9)}s`,
                            );

                            setTimeout(() => {
                                setIsSuccess(false);
                                closeDialog('my-tranches-dialog');
                            }, TIMER_CLOSE_DELAY);
                        }}
                        label="Save"
                        primary
                    />
                </div>
            </div>
        </>
    );
};
