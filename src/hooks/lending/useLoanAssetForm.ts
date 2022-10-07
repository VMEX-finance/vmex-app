import React from 'react';
import { useMethods } from 'react-use';

type Tranch = [string, unknown][];

type Speed = 'fast' | 'medium' | 'slow';

export interface ILoanForm {
    amount: number | null;
    tranch0: number | null;
    tranch1: number | null;
    tranch2: number | null;
    speed: Speed;
}

const initialState: ILoanForm = {
    amount: null,
    tranch0: null,
    tranch1: null,
    tranch2: null,
    speed: 'medium',
};

export function createMethods(state: ILoanForm) {
    return {
        update(data: any) {
            return { ...state, ...data };
        },
    };
}

export function useLoanAssetForm(availableTranches: any) {
    const [state, methods] = useMethods(createMethods, initialState);

    function updateTranch(id: string, data: number) {}

    React.useEffect(() => {}, []);

    return {
        ...state,
    };
}

export function useTranceState() {
    const [enabled, setEnabled] = React.useState();
}
