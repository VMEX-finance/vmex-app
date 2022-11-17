import React, { useEffect } from 'react';
import { TransactionStatus } from '../components/statuses';
import { Button, DropdownButton } from '../components/buttons';
import { TIMER_CLOSE_DELAY } from '../../utils/constants';
import { useMyTranchesContext, useTransactionsContext } from '../../store/contexts';
import { DefaultInput, ListInput } from '../components/inputs';
import { IDialogProps } from '.';
import { ModalFooter, ModalHeader } from '../modals/subcomponents';

export const MyTranchesDialog: React.FC<IDialogProps> = ({ name, data, closeDialog }) => {
    const { newTransaction } = useTransactionsContext();
    const { updateTranche, myTranches, deleteTranche, pauseTranche } = useMyTranchesContext();
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState('');

    const [selectedTranche, setSelectedTranche] = React.useState(
        myTranches.length > 0
            ? myTranches[0]
            : {
                  id: 0,
                  name: '',
                  whitelisted: [],
                  blacklisted: [],
                  tokens: [],
                  adminFee: '0.2',
                  pausedTokens: [],
              },
    );

    const [_name, setName] = React.useState(selectedTranche.name);
    const [_whitelisted, setWhitelisted] = React.useState(selectedTranche.whitelisted);
    const [_blackListed, setBlackListed] = React.useState(selectedTranche.blacklisted);
    const [_tokens, setTokens] = React.useState(selectedTranche.tokens);
    const [_adminFee, setAdminFee] = React.useState(selectedTranche.adminFee);
    const [_pausedTokens, setPausedTokens] = React.useState(selectedTranche.pausedTokens);

    const findSelectedTranche = (name: string) => {
        const found = myTranches.find((el) => el.name === name);
        setSelectedTranche(found as any);
    };

    const handleSave = () => {
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
        updateTranche({
            id: selectedTranche.id,
            name: _name,
            whitelisted: _whitelisted,
            blacklisted: _blackListed,
            tokens: _tokens,
            adminFee: _adminFee,
            pausedTokens: _pausedTokens,
        });
        newTransaction(
            `0x${Math.floor(Math.random() * 9)}...${Math.floor(Math.random() * 9)}${Math.floor(
                Math.random() * 9,
            )}s`,
        );

        setTimeout(() => {
            setIsSuccess(false);
            closeDialog('my-tranches-dialog');
        }, TIMER_CLOSE_DELAY);
    };

    const handleDelete = () => {
        deleteTranche(selectedTranche.id);
        setIsSuccess(true);
        newTransaction(
            `0x${Math.floor(Math.random() * 9)}...${Math.floor(Math.random() * 9)}${Math.floor(
                Math.random() * 9,
            )}s`,
        );

        setTimeout(() => {
            setIsSuccess(false);
            closeDialog('my-tranches-dialog');
        }, TIMER_CLOSE_DELAY);
    };

    const handlePause = () => {
        pauseTranche(selectedTranche.id);
        setIsSuccess(true);

        newTransaction(
            `0x${Math.floor(Math.random() * 9)}...${Math.floor(Math.random() * 9)}${Math.floor(
                Math.random() * 9,
            )}s`,
        );

        setTimeout(() => {
            setIsSuccess(false);
        }, TIMER_CLOSE_DELAY);
    };

    useEffect(() => {
        setName(selectedTranche.name);
        setWhitelisted(selectedTranche.whitelisted);
        setBlackListed(selectedTranche.blacklisted);
        setTokens(selectedTranche.tokens);
        setAdminFee(selectedTranche.adminFee);
        setPausedTokens(selectedTranche.pausedTokens);
    }, [selectedTranche]);

    return (
        <>
            <ModalHeader dialog="my-tranches-dialog" title={name} />
            {!isSuccess ? (
                // Default State
                <>
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
                        noDelete
                    />
                    <div className="w-full mt-6">
                        <DropdownButton
                            title="Paused Tokens"
                            items={_tokens}
                            selected={_pausedTokens}
                            setSelected={setPausedTokens}
                            direction="right"
                            size="lg"
                            full
                            multiselect
                            border
                            uppercase
                        />
                    </div>
                </>
            ) : (
                <div className="mt-10 mb-8">
                    <TransactionStatus success={isSuccess} full />
                </div>
            )}

            {error && !isSuccess && <p className="text-red-500">{error || 'Invalid input'}</p>}

            <ModalFooter>
                <Button
                    disabled={isSuccess}
                    onClick={handlePause}
                    label={selectedTranche.isPaused ? 'Unpause Tranche' : 'Pause Tranche'}
                    type="delete"
                />
                <Button disabled={isSuccess} onClick={handleSave} label="Save" primary />
            </ModalFooter>
        </>
    );
};
