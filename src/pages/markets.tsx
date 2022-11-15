import React from 'react';
import { AppTemplate } from '../ui/templates';
import { MarketsTable } from '../ui/tables';
import { TokenData } from '../hooks/user-data';
import { ITokenData } from '../store/token-data';
import { MOCK_MARKETS_DATA } from '../utils/mock-data';

const Markets: React.FC = () => {
    const { isLoading, error, error_msg, data }: ITokenData = TokenData();

    return (
        <AppTemplate title="markets">
            <MarketsTable data={MOCK_MARKETS_DATA} />
        </AppTemplate>
    );
};
export default Markets;
