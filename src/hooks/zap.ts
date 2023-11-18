import { constants, utils } from 'ethers';
import { SyntheticEvent, useEffect, useState } from 'react';

const EMPTY_TOKEN = { address: '', symbol: '' };

type IZapAssetProps = { symbol: string; address: string };

export const useZap = (symbolOrAddress: string) => {
    const [assets, setAssets] = useState<IZapAssetProps[]>([
        { symbol: 'ETH', address: constants.AddressZero },
    ]); // for testing
    const [isLoading, setIsLoading] = useState(false);
    const [zapAsset, setZapAsset] = useState({ address: '', symbol: '' });
    const [zapAmount, setZapAmount] = useState('');
    const [isMaxZap, setIsMaxZap] = useState(false);

    function handleZap(e: any, token: IZapAssetProps) {
        e?.preventDefault();
        if (token.address === zapAsset.address) setZapAsset(EMPTY_TOKEN);
        else setZapAsset(token);
    }

    async function submitZap(e: SyntheticEvent) {
        e.preventDefault();
        // TODO: fico - handle zap sumbit
        console.log(`Zapping ${zapAsset.symbol}`);
    }

    useEffect(() => {
        if (symbolOrAddress) {
            (async () => {
                // TODO: fico - handle finding zappable assets for symbolOrAddress
            })().catch((err) => console.error(err));
        }
    }, [symbolOrAddress]);

    return {
        zappableAssets: assets,
        handleZap,
        isLoading,
        zapAsset,
        zapAmount,
        setZapAmount,
        setIsMaxZap,
        submitZap,
    };
};
