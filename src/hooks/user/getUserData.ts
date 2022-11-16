import { useQuery } from '@tanstack/react-query';
import { IUserPerformanceCardProps } from '../../ui/features';
import {
    MOCK_LINE_DATA,
    MOCK_LINE_DATA_2,
    MOCK_YOUR_BORROWS,
    MOCK_YOUR_SUPPLIES,
} from '../../utils/mock-data';
import { IUserActivityDataProps, IUserDataProps } from './types';

// Gets
export function getUserPerformanceData(): IUserPerformanceCardProps {
    return {
        tranches: [],
        profitLossChart: MOCK_LINE_DATA,
        insuranceChart: MOCK_LINE_DATA_2,
        loanedAssets: MOCK_YOUR_SUPPLIES,
    };
}

export function getUserActivityData(): IUserActivityDataProps {
    return {
        supplies: MOCK_YOUR_SUPPLIES,
        borrows: MOCK_YOUR_BORROWS,
    };
}

// Master
export function useUserData(): IUserDataProps {
    const queryUserPerformance = useQuery({
        queryKey: ['user-performance'],
        queryFn: getUserPerformanceData,
    });

    const queryUserActivity = useQuery({
        queryKey: ['user-activity'],
        queryFn: getUserActivityData,
    });

    return {
        queryUserPerformance,
        queryUserActivity,
    };
}
