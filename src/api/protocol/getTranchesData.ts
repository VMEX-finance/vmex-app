import { ITrancheProps } from '@models/tranches';
import { useQuery } from '@tanstack/react-query';
import { MOCK_TRANCHES_DATA } from '../../utils/mock-data';
import { ITranchesDataProps } from './types';

export function getAllTranches(): ITrancheProps[] {
    return MOCK_TRANCHES_DATA;
}

export function useTranchesData(): ITranchesDataProps {
    const queryAllTranches = useQuery({
        queryKey: ['all-tranches'],
        queryFn: getAllTranches,
    });

    return {
        queryAllTranches,
    };
}
