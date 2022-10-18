export type ITrancheProps = {
    tranche: string;
    assets: string[];
    aggregateRating: string;
    yourActivity: 'deposited' | 'supplied' | 'both' | 'none'; // Can also be represented in another way if necessary (i.e. 1 = 'deposited', 2 = 'supplied', etc.)
    supplyTotal: number | string;
    borrowTotal: number | string;
};
