import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

export const useZap = (symbolOrAddress: string) => {
    const { chain } = useNetwork();
    const [assets, setAssets] = useState<{ symbol: string; address: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    async function handleZap(e: any) {
        e?.preventDefault();
        // TODO: fico - handle zapping
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
    };
};
