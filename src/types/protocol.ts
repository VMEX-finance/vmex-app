export type IProtocolActions =
    | 'lend'
    | 'borrow'
    | 'loop'
    | 'unwind'
    | 'lock'
    | 'stake'
    | 'withdraw';

export type ITransactionStatus = 'error' | 'pending' | 'complete';
