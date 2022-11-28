import React from 'react';
import { TransactionStatus } from '../../components/statuses';
import { Button } from '../../components/buttons';
import { AVAILABLE_ASSETS } from '../../../utils/constants';
import { useMyTranchesContext } from '../../../store/contexts';
import { DefaultInput, ListInput } from '../../components/inputs';
import { IDialogProps } from '../utils';
import { Stepper, StepperChild } from '../../components/tabs';
import { useStepper } from '../../../hooks/ui/useStepper';
import { ModalFooter, ModalHeader } from '../../modals/subcomponents';
import { CreateTrancheAssetsTable } from '../../tables';
import { InnerCard } from '../../components/cards';
import { useModal } from '../../../hooks/ui';

export const CreateTrancheDialog: React.FC<IDialogProps> = ({ name, data, closeDialog }) => {
    const { setError, isSuccess, error, submitTx, isLoading } = useModal('create-tranche-dialog');
    const { newTranche, myTranches } = useMyTranchesContext();
    const { steps, nextStep, prevStep, activeStep } = useStepper([
        { name: 'Create Tranche', status: 'current' },
        { name: 'Manage Assets', status: 'upcoming' },
    ]);

    const [_name, setName] = React.useState('');
    const [_whitelisted, setWhitelisted] = React.useState([]);
    const [_blackListed, setBlackListed] = React.useState([]);
    const [_tokens, setTokens] = React.useState([]);
    const [_adminFee, setAdminFee] = React.useState('0.2');
    const [_collateralTokens, setCollateralTokens] = React.useState([]);
    const [_borrowLendTokens, setBorrowLendTokens] = React.useState([]);

    const handleSubmit = async () => {
        if (myTranches?.length > 0 && myTranches.map((obj) => obj.name).includes(_name))
            setError('Tranche name already in use.');
        if (!_name) setError('Please enter a tranche name.');
        if (_tokens?.length === 0) setError('Please enter tokens to be included in your tranche.');
        if (error) return;

        await submitTx(() => {
            newTranche({
                name: _name,
                whitelisted: _whitelisted,
                blacklisted: _blackListed,
                tokens: _tokens,
                adminFee: _adminFee,
                lendAndBorrowTokens: _borrowLendTokens,
                collateralTokens: _collateralTokens,
            });
        });
    };

    return (
        <>
            <ModalHeader title={name} dialog="create-tranche-dialog" />
            <div className="mt-2">
                <Stepper steps={steps} previous={prevStep} next={nextStep} />
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
                                required
                            />
                            <DefaultInput
                                type="percent"
                                value={_adminFee}
                                onType={setAdminFee}
                                size="2xl"
                                placeholder="0.00"
                                title="Admin Fee (%)"
                                tooltip="Admin fees will be distributed to the wallet address used to create the tranche. Admin fees set are additive to the base 5% fee taken by VMEX"
                                required
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
                            autocomplete={AVAILABLE_ASSETS}
                            setList={setTokens}
                            placeholder="USDC"
                            coin
                            required
                        />
                    </StepperChild>
                    <StepperChild active={activeStep === 1}>
                        <div className="mt-6">
                            <InnerCard className="max-h-60 overflow-y-auto">
                                <CreateTrancheAssetsTable
                                    assets={_tokens}
                                    collateralAssets={_collateralTokens}
                                    lendAssets={_borrowLendTokens}
                                    lendClick={setBorrowLendTokens}
                                    collateralClick={setCollateralTokens}
                                />
                            </InnerCard>
                        </div>
                    </StepperChild>
                </>
            ) : (
                <div className="mt-10 mb-8">
                    <TransactionStatus success={isSuccess} full />
                </div>
            )}

            {error && !isSuccess && <p className="text-red-500">{error || 'Invalid input'}</p>}

            <ModalFooter>
                <Button
                    disabled={isSuccess || activeStep === 0}
                    onClick={prevStep}
                    label="Back"
                    primary
                />

                <Button
                    disabled={isSuccess}
                    onClick={activeStep === steps.length - 1 ? handleSubmit : nextStep}
                    label={activeStep === steps.length - 1 ? 'Save' : 'Next'}
                    primary
                    loading={isLoading}
                />
            </ModalFooter>
        </>
    );
};