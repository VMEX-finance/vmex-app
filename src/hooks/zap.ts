import { useEffect, useState } from 'react';
import { toSymbol } from '@/utils';
import { Chain, useNetwork } from 'wagmi';

const ZAPPABLE_MAPPINGS = new Map();

export const useZap = (symbolOrAddress: string) => {
    const { chain } = useNetwork();
    const [assets, setAssets] = useState<{ symbol: string; address: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    async function handleZap(e: any) {
        e?.preventDefault();
        // TODO: handle zapping
    }

    useEffect(() => {
        if (symbolOrAddress) {
            (async () => {
                // TODO: handle finding zappable assets for symbolOrAddress
            })().catch((err) => console.error(err));
        }
    }, [symbolOrAddress]);

    return {
        zappableAssets: assets,
        handleZap,
        isLoading,
    };
};
