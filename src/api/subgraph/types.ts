export type IGraphHistoryProps = {
    action?: 'Borrow' | 'Deposit';
    amount: string;
    timestamp: number;
    reserve: {
        symbol: string;
        name?: string;
    };
};

export type IGraphTrancheProps = {
    id: string;
    borrowHistory: IGraphHistoryProps[];
    depositHistory: IGraphHistoryProps[];
};
