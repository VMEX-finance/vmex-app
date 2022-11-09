import React from 'react';
import { Dialog } from '@headlessui/react';
import { IoIosClose } from 'react-icons/io';
import { TransactionStatus } from '../../components/statuses';
import { Button } from '../../components/buttons';
import { TIMER_CLOSE_DELAY } from '../../../utils/constants';
import { useMyTranchesContext, useTransactionsContext } from '../../../store/contexts';
import { DefaultInput, ListInput } from '../../../ui/components/inputs';
import { IDialogProps } from '.';

export const CreateTrancheDialog: React.FC<IDialogProps> = ({ name, data, closeDialog }) => {
    const { newTransaction } = useTransactionsContext();
    const { newTranche, myTranches } = useMyTranchesContext();
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState('');

    const [_name, setName] = React.useState('');
    const [_whitelisted, setWhitelisted] = React.useState([]);
    const [_blackListed, setBlackListed] = React.useState([]);
    const [_tokens, setTokens] = React.useState([]);
    const [_adminFee, setAdminFee] = React.useState('0.2');

    const handleSubmit = () => {
        if (
            myTranches &&
            myTranches.length > 0 &&
            myTranches.map((obj) => obj.name).includes(_name)
        ) {
            setError('Tranche name already in use.');
            return;
        }
        if (!_name) {
            setError('Please enter a tranche name.');
            return;
        }
        if (_tokens?.length === 0) {
            setError('Please enter tokens to be included in your tranche.');
            return;
        }
        setError('');
        setIsSuccess(true);
        newTranche({
            name: _name,
            whitelisted: _whitelisted,
            blacklisted: _blackListed,
            tokens: _tokens,
            adminFee: _adminFee,
        });
        newTransaction(
            `0x${Math.floor(Math.random() * 9)}...${Math.floor(Math.random() * 9)}${Math.floor(
                Math.random() * 9,
            )}s`,
        );

        setTimeout(() => {
            setIsSuccess(false);
            closeDialog('create-tranche-dialog');
        }, TIMER_CLOSE_DELAY);
    };

    return (
        <>
            <div className="flex flex-row justify-between">
                <div className="mt-3 text-left sm:mt-5">
                    <Dialog.Title as="h3" className="text-xl leading-6 font-medium text-gray-900">
                        {name}
                    </Dialog.Title>
                </div>
                <button
                    className="self-baseline h-fit w-fit cursor-pointer text-neutral-900 hover:text-neutral-600 transition duration-200"
                    onClick={() => closeDialog('create-tranche-dialog')}
                >
                    <IoIosClose className="w-7 h-7" />
                </button>
            </div>
            {!isSuccess ? (
                // Default State
                <>
                    <div className="flex flex-col md:grid md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] md:gap-3">
                        <DefaultInput
                            value={_name}
                            onType={setName}
                            size="2xl"
                            placeholder="VMEX High Quality..."
                            title="Name"
                        />
                        <DefaultInput
                            type="percent"
                            value={_adminFee}
                            onType={setAdminFee}
                            size="2xl"
                            placeholder="0.00"
                            title="Admin Fee (%)"
                            tooltip="Admin fees will be distributed to the wallet address used to create the tranche. Admin fees set are additive to the base 5% fee taken by VMEX"
                        />
                    </div>
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

            {error && !isSuccess && <p className="text-red-500">{error || 'Invalid input'}</p>}

            <div className="mt-5 sm:mt-6 flex justify-end items-end">
                <div>
                    <Button disabled={isSuccess} onClick={handleSubmit} label="Save" primary />
                </div>
            </div>
        </>
    );
};
