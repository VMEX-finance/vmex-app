import React, { useEffect } from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import {
    Button,
    Card,
    DefaultDropdown,
    DefaultInput,
    ListInput,
    TransactionStatus,
    WalletButton,
} from '../ui/components';
import { useAccount } from 'wagmi';
import { useMyTranchesContext } from '../store';
import { useModal, useWindowSize } from '../hooks';
import { ProtocolStatsCard, TrancheStatsCard } from '../ui/features';

const MyTranches: React.FC = () => {
    const breakpoint = 1024;
    const { width } = useWindowSize();
    const { address } = useAccount();
    const { isSuccess, error, submitTx, setError, isLoading } = useModal('my-tranches-dialog');
    const { updateTranche, myTranches, deleteTranche, pauseTranche } = useMyTranchesContext();

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

    const handleSave = async () => {
        if (!_name) setError('Please enter a tranche name.');
        if (_tokens?.length === 0) setError('Please enter tokens to be included in your tranche.');

        await submitTx(async () => {
            const res = await updateTranche({
                id: selectedTranche.id,
                name: _name,
                whitelisted: _whitelisted,
                blacklisted: _blackListed,
                tokens: _tokens,
                adminFee: _adminFee,
                pausedTokens: _pausedTokens,
            });
            return res;
        }, false);
    };

    const handleDelete = async () => {
        await submitTx(async () => {
            const res = await deleteTranche(selectedTranche.id);
            return res;
        });
    };

    const handlePause = async () => {
        await submitTx(async () => {
            const res = await pauseTranche(selectedTranche.id);
            return res;
        }, false);
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
        <AppTemplate title="My Tranches" description={`${selectedTranche.name}`}>
            {address ? (
                <>
                    {' '}
                    {width < breakpoint && (
                        <div className="w-full">
                            <DefaultDropdown
                                items={myTranches.map((obj) => ({
                                    ...obj,
                                    text: obj.name,
                                }))}
                                selected={selectedTranche.name}
                                setSelected={(e: string) => findSelectedTranche(e)}
                                direction="right"
                                size="lg"
                                primary
                                full
                            />
                        </div>
                    )}
                    <GridView>
                        <>
                            {width >= breakpoint && (
                                <Card className="flex flex-col min-w-[300px] overflow-y-auto">
                                    {myTranches.map((obj, i) => (
                                        <button
                                            className={`
                          text-left py-2 
                          ${selectedTranche.name === obj.name ? 'text-brand-purple' : ''}
                        `}
                                            onClick={(e: any) =>
                                                findSelectedTranche(e.target.innerHTML)
                                            }
                                            key={`my-tranches-${i}`}
                                        >
                                            {obj.name}
                                        </button>
                                    ))}
                                </Card>
                            )}
                            <div className="flex flex-col gap-4">
                                <TrancheStatsCard />
                                <Card>
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
                                                    className="!mt-0"
                                                />
                                                <DefaultInput
                                                    type="percent"
                                                    value={_adminFee}
                                                    onType={setAdminFee}
                                                    size="2xl"
                                                    placeholder="0.00"
                                                    title="Admin Fee (%)"
                                                    tooltip="Admin fees will be distributed to the wallet address used to create the tranche. Admin fees set are additive to the base 5% fee taken by VMEX"
                                                    className="!mt-0"
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
                                                <DefaultDropdown
                                                    title="Paused Tokens"
                                                    items={_tokens}
                                                    selected={_pausedTokens}
                                                    setSelected={setPausedTokens}
                                                    direction="top"
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

                                    {error && !isSuccess && (
                                        <p className="text-red-500">{error || 'Invalid input'}</p>
                                    )}
                                    <div className="mt-6 flex justify-end gap-3">
                                        <Button
                                            disabled={isSuccess}
                                            onClick={handlePause}
                                            label={
                                                selectedTranche.isPaused
                                                    ? 'Unpause Tranche'
                                                    : 'Pause Tranche'
                                            }
                                            type="delete"
                                            loading={isLoading}
                                        />
                                        <Button
                                            disabled={isSuccess}
                                            onClick={handleSave}
                                            label="Save"
                                            loading={isLoading}
                                            primary
                                        />
                                    </div>
                                </Card>
                            </div>
                        </>
                    </GridView>
                </>
            ) : (
                <div className="pt-10 lg:pt-20 text-center flex-col">
                    <div className="mb-4">
                        <span className="text-lg lg:text-2xl">Please connect your wallet.</span>
                    </div>
                    <WalletButton primary className="w-fit" />
                </div>
            )}
        </AppTemplate>
    );
};
export default MyTranches;
