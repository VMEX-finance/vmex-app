import React, { useEffect } from 'react';
import {
    DefaultInput,
    ListInput,
    TransactionStatus,
    Stepper,
    StepperChild,
    Button,
    MessageStatus,
} from '../../components';
import { IDialogProps } from '../utils';
import { useStepper, useModal } from '../../../hooks';
import { ModalFooter, ModalHeader } from '../../modals/subcomponents';
import { CreateTrancheAssetsTable } from '../../tables';
import { NETWORK, AVAILABLE_ASSETS, SDK_PARAMS, checkProfanity } from '../../../utils';
import { useAccount, useSigner } from 'wagmi';
import { initTranche } from '@vmexfinance/sdk';
import { useSubgraphUserData } from '../../../api';

export const CreateTrancheDialog: React.FC<IDialogProps> = ({ name, data, closeDialog }) => {
    const { address } = useAccount();
    const { data: signer } = useSigner();
    const { setError, isSuccess, error, submitTx, isLoading } = useModal('create-tranche-dialog');
    const { queryTrancheAdminData } = useSubgraphUserData(address || '');
    const { steps, nextStep, prevStep, activeStep } = useStepper([
        { name: 'Create Tranche', status: 'current' },
        { name: 'Manage Assets', status: 'upcoming' },
    ]);

    const [_name, setName] = React.useState('');
    const [treasuryAddress, setTreasuryAddress] = React.useState(address ? address : '');
    const [_whitelisted, setWhitelisted] = React.useState([]);
    const [_blackListed, setBlackListed] = React.useState([]);
    const [_tokens, setTokens] = React.useState<any[]>([]);
    const [_adminFee, setAdminFee] = React.useState([]);
    const [_collateralTokens, setCollateralTokens] = React.useState([]);
    const [_borrowLendTokens, setBorrowLendTokens] = React.useState([]);

    const chunkMaxSize = 10;

    const handleSubmit = async () => {
        // TODO: change to check all tranches
        if (
            queryTrancheAdminData.data &&
            queryTrancheAdminData?.data?.length > 0 &&
            queryTrancheAdminData.data?.map((obj) => obj.name).includes(_name)
        )
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
                reserveFactors: _adminFee.map((el: string) => (Number(el) * 100).toFixed(0)),
                canBorrow: canBorrow,
                canBeCollateral: canBeCollateral,
                admin: signer,
                treasuryAddress: treasuryAddress,
                incentivesController: '0x0000000000000000000000000000000000000000', //disabled for now
                network: NETWORK,
                test: SDK_PARAMS.test,
                providerRpc: SDK_PARAMS.providerRpc,
                chunks: chunkMaxSize,
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
            {!isSuccess && !error ? (
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
                                className="flex w-full flex-col mt-6"
                            />
                        </div>
                        <MessageStatus
                            type="error"
                            show={checkProfanity(_name)}
                            message="Please keep your degen to a minimum"
                        />
                        <DefaultInput
                            value={treasuryAddress}
                            onType={setTreasuryAddress}
                            size="2xl"
                            placeholder=""
                            title="Treasury Address"
                            required
                            className="flex w-full flex-col mt-6"
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
                            _adminFee={_adminFee}
                            setAdminFee={setAdminFee}
                            direction="top"
                            listStayOpen={true}
                        />
                    </StepperChild>

                    <StepperChild active={activeStep === 1}>
                        <div className="mt-6">
                            <CreateTrancheAssetsTable
                                assets={_tokens}
                                setAssets={setTokens}
                                collateralAssets={_collateralTokens}
                                lendAssets={_borrowLendTokens}
                                lendClick={setBorrowLendTokens}
                                collateralClick={setCollateralTokens}
                                _adminFee={_adminFee}
                                setAdminFee={setAdminFee}
                            />
                        </div>

                        <MessageStatus
                            type="error"
                            show={_adminFee.some((el) => Number(el) > 100)}
                            message="Admin fees must be less than 100"
                        />
                    </StepperChild>
                </>
            ) : (
                <div className="mt-10 mb-8">
                    <TransactionStatus success={isSuccess} errorText={error} full />
                </div>
            )}

            {!error && isSuccess && (
                <p className="text-emerald-600 break-words text-center px-12">
                    {
                        'Tranche successfully created! Please wait or refresh the page to see your new tranche.'
                    }
                </p>
            )}

            {error && !isSuccess && (
                <p className="text-red-500 break-words">{error || 'Invalid input'}</p>
            )}

            {isLoading && (
                <span className="italic text-sm">
                    There are{' '}
                    {Math.ceil(_tokens.length / chunkMaxSize) +
                        2 +
                        Number(_blackListed.length !== 0) +
                        Number(_whitelisted.length !== 0)}{' '}
                    transactions to be signed. The transaction order is as follows: <br />
                    1) claim the tranche id
                    <br />
                    2) set treasury address
                    <br />
                    3) set blacklist/whitelist if specified
                    <br />
                    4) initialize the reserves in batches of 10
                    <br />
                </span>
            )}

            <ModalFooter>
                <Button
                    disabled={isSuccess || activeStep === 0}
                    onClick={prevStep}
                    label="Back"
                    primary
                />

                <Button
                    disabled={
                        isSuccess ||
                        error !== '' ||
                        checkProfanity(_name) ||
                        _adminFee.some((el) => Number(el) > 100) ||
                        !_name ||
                        !treasuryAddress
                    }
                    onClick={activeStep === steps.length - 1 ? handleSubmit : nextStep}
                    label={activeStep === steps.length - 1 ? 'Save' : 'Next'}
                    primary
                    loading={isLoading}
                />
            </ModalFooter>
        </>
    );
};
