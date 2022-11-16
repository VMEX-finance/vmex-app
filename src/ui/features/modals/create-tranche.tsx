import React from 'react';
import { TransactionStatus } from '../../components/statuses';
import { Button } from '../../components/buttons';
import { TIMER_CLOSE_DELAY } from '../../../utils/constants';
import { useMyTranchesContext, useTransactionsContext } from '../../../store/contexts';
import { DefaultInput, ListInput } from '../../components/inputs';
import { IDialogProps } from '.';
import { Stepper, StepperChild } from '../../components/tabs';
import { useStepper } from '../../../hooks/ui/useStepper';
import { ModalHeader } from '../../components/modals';

export const CreateTrancheDialog: React.FC<IDialogProps> = ({ name, data, closeDialog }) => {
    const { newTransaction } = useTransactionsContext();
    const { newTranche, myTranches } = useMyTranchesContext();
    const { steps, nextStep, prevStep, activeStep } = useStepper([
        { name: 'Create Tranche', status: 'current' },
        { name: 'Manage Assets', status: 'upcoming' },
    ]);

    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState('');

    const [_name, setName] = React.useState('');
    const [_whitelisted, setWhitelisted] = React.useState([]);
    const [_blackListed, setBlackListed] = React.useState([]);
    const [_tokens, setTokens] = React.useState([]);
    const [_adminFee, setAdminFee] = React.useState('0.2');

    const handleSubmit = () => {
        nextStep();
        // if (
        //     myTranches &&
        //     myTranches.length > 0 &&
        //     myTranches.map((obj) => obj.name).includes(_name)
        // ) {
        //     setError('Tranche name already in use.');
        //     return;
        // }
        // if (!_name) {
        //     setError('Please enter a tranche name.');
        //     return;
        // }
        // if (_tokens?.length === 0) {
        //     setError('Please enter tokens to be included in your tranche.');
        //     return;
        // }
        // setError('');
        // setIsSuccess(true);
        // newTranche({
        //     name: _name,
        //     whitelisted: _whitelisted,
        //     blacklisted: _blackListed,
        //     tokens: _tokens,
        //     adminFee: _adminFee,
        // });
        // newTransaction(
        //     `0x${Math.floor(Math.random() * 9)}...${Math.floor(Math.random() * 9)}${Math.floor(
        //         Math.random() * 9,
        //     )}s`,
        // );

        // setTimeout(() => {
        //     setIsSuccess(false);
        //     closeDialog('create-tranche-dialog');
        // }, TIMER_CLOSE_DELAY);
    };

    return (
        <>
            <ModalHeader title={name} dialog="create-tranche-dialog" />
            <div className="mt-2">
                <Stepper steps={steps} previous={prevStep} />
            </div>
            {!isSuccess ? (
                // Default State
                <>
                    <StepperChild active={activeStep === 0}>
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
                    </StepperChild>
                    <StepperChild active={activeStep === 1}>
                        <div>yo</div>
                    </StepperChild>
                </>
            ) : (
                <div className="mt-10 mb-8">
                    <TransactionStatus success={isSuccess} full />
                </div>
            )}

            {error && !isSuccess && <p className="text-red-500">{error || 'Invalid input'}</p>}

            <div className="mt-5 sm:mt-6 flex justify-end items-end">
                <div>
                    <Button disabled={isSuccess} onClick={prevStep} label="Back" primary />

                    <Button disabled={isSuccess} onClick={handleSubmit} label="Save" primary />
                </div>
            </div>
        </>
    );
};
