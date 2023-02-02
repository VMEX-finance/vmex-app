import React, { useEffect } from 'react';
import { useMyTranchesContext } from '../../../store';
import {
    DefaultInput,
    ListInput,
    TransactionStatus,
    Stepper,
    StepperChild,
    InnerCard,
    Button,
} from '../../components';
import { IDialogProps } from '../utils';
import { useStepper, useModal } from '../../../hooks';
import { ModalFooter, ModalHeader } from '../../modals/subcomponents';
import { CreateTrancheAssetsTable } from '../../tables';
import { NETWORK, AVAILABLE_ASSETS, SDK_PARAMS } from '../../../utils';
import { useAccount, useSigner } from 'wagmi';
import { ethers } from 'ethers';
import { convertSymbolToAddress, initTranche } from '@vmexfinance/sdk';

export const CreateTrancheDialog: React.FC<IDialogProps> = ({ name, data, closeDialog }) => {
    const { address } = useAccount();
    const { data: signer } = useSigner();
    const { setError, isSuccess, error, submitTx, isLoading } = useModal('create-tranche-dialog');
    const { myTranches } = useMyTranchesContext();
    const { steps, nextStep, prevStep, activeStep } = useStepper([
        { name: 'Create Tranche', status: 'current' },
        { name: 'Manage Assets', status: 'upcoming' },
    ]);

    const [_name, setName] = React.useState('');
    const [treasuryAddress, setTreasuryAddress] = React.useState(address ? address : '');
    const [_whitelisted, setWhitelisted] = React.useState([]);
    const [_blackListed, setBlackListed] = React.useState([]);
    const [_tokens, setTokens] = React.useState<any[]>([]);
    const [_adminFee, setAdminFee] = React.useState('20');
    const [_collateralTokens, setCollateralTokens] = React.useState([]);
    const [_borrowLendTokens, setBorrowLendTokens] = React.useState([]);

    const handleSubmit = async () => {
        if (myTranches?.length > 0 && myTranches.map((obj) => obj.name).includes(_name))
            setError('Tranche name already in use.');
        if (!_name) setError('Please enter a tranche name.');
        if (_tokens?.length === 0) setError('Please enter tokens to be included in your tranche.');
        if (error) return;
        if (!signer) {
            setError('Please refresh the page and make sure your wallet is connected.');
            return;
        }
        let canBorrow: boolean[] = [];
        let canBeCollateral: boolean[] = [];

        _tokens.map((el: string) => {
            const findBorrow = _borrowLendTokens.find((el1) => el1 == el);
            if (findBorrow) {
                canBorrow.push(true);
            } else {
                canBorrow.push(false);
            }

            const findCollat = _collateralTokens.find((el1) => el1 == el);
            if (findCollat) {
                canBeCollateral.push(true);
            } else {
                canBeCollateral.push(false);
            }
        });

        await submitTx(async () => {
            const res = await initTranche({
                name: _name,
                whitelisted: _whitelisted,
                blacklisted: _blackListed,
                assetAddresses: _tokens,
                reserveFactors: new Array(_tokens.length).fill(
                    ethers.utils.parseUnits(_adminFee, 2),
                ),
                canBorrow: canBorrow,
                canBeCollateral: canBeCollateral,
                admin: signer,
                treasuryAddress: treasuryAddress,
                incentivesController: '0x0000000000000000000000000000000000000000', //disabled for now
                network: NETWORK,
                test: SDK_PARAMS.test,
                providerRpc: SDK_PARAMS.providerRpc,
            });
            return res;
        });
    };

    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => setError(''), 5000);
            return () => clearInterval(timeout);
        }
    }, [error, setError]);

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
                                title="Tranche Name"
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
                        <DefaultInput
                            value={treasuryAddress}
                            onType={setTreasuryAddress}
                            size="2xl"
                            placeholder=""
                            title="Treasury Address"
                            required
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
                            autocomplete={AVAILABLE_ASSETS.filter((val) => !_tokens.includes(val))}
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

            {error && !isSuccess && (
                <p className="text-red-500 break-words">{error || 'Invalid input'}</p>
            )}

            <ModalFooter>
                <Button
                    disabled={isSuccess || activeStep === 0}
                    onClick={prevStep}
                    label="Back"
                    primary
                />

                <Button
                    disabled={isSuccess || error !== ''}
                    onClick={activeStep === steps.length - 1 ? handleSubmit : nextStep}
                    label={activeStep === steps.length - 1 ? 'Save' : 'Next'}
                    primary
                    loading={isLoading}
                />
            </ModalFooter>
        </>
    );
};
