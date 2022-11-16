import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IUserPerformanceCardProps } from '../../ui/features';
import { MOCK_LINE_DATA, MOCK_LINE_DATA_2, MOCK_YOUR_SUPPLIES } from '../../utils/mock-data';

export function getUserPerformanceData(): IUserPerformanceCardProps {
    return {
        tranches: [],
        profitLossChart: MOCK_LINE_DATA,
        insuranceChart: MOCK_LINE_DATA_2,
        loanedAssets: MOCK_YOUR_SUPPLIES,
    };
}

type IUserDataProps = {
    queryUserPerformance: UseQueryResult<IUserPerformanceCardProps, unknown>;
};

export function useUserData(): IUserDataProps {
    const queryUserPerformance = useQuery({
        queryKey: ['user-performance'],
        queryFn: getUserPerformanceData,
    });

    return {
        queryUserPerformance,
    };
}
