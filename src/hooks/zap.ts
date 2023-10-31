import { useEffect, useState } from 'react';
import { toSymbol } from '@/utils';
import { Chain, useNetwork } from 'wagmi';

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
            // TODO: handle finding zappable assets for symbolOrAddress
        }
    }, [symbolOrAddress]);

    return {
        zappableAssets: assets,
        handleZap,
        isLoading,
    };
};
