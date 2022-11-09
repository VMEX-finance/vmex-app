import React from 'react';
import { Dialog } from '@headlessui/react';
import { IoIosClose } from 'react-icons/io';
import { TransactionStatus } from '../../components/statuses';
import { Button } from '../../components/buttons';
import { TIMER_CLOSE_DELAY } from '../../../utils/constants';
import { useMyTranchesContext, useTransactionsContext } from '../../../store/contexts';
import { DefaultInput, ListInput } from '../../../ui/components/inputs';

interface IDialogProps {
    name?: string;
    data?: any;
    closeDialog(e: any): void;
}

export const CreateTrancheDialog: React.FC<IDialogProps> = ({ name, data, closeDialog }) => {
    const { newTransaction } = useTransactionsContext();
    const { newTranche } = useMyTranchesContext();
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isError, setIsError] = React.useState(false);

    const [_name, setName] = React.useState('');
    const [_whitelisted, setWhitelisted] = React.useState([]);
    const [_blackListed, setBlackListed] = React.useState([]);
    const [_tokens, setTokens] = React.useState([]);

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
                    onClick={() => closeDialog('create-tranche-dialog')}
                >
                    <IoIosClose className="w-7 h-7" />
                </div>
            </div>
            {!isSuccess && !isError ? (
                // Default State
                <>
                    <h3 className="mt-6 mb-1 text-gray-400">Name</h3>
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
                        toggle
                    />
                    <ListInput
                        title="Blacklisted"
                        list={_blackListed}
                        setList={setBlackListed}
                        placeholder="0x..."
                        toggle
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
                <div>
                    <Button
                        disabled={isSuccess || isError}
                        onClick={() => {
                            setIsSuccess(true);
                            newTranche({
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
                                closeDialog('create-tranche-dialog');
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
