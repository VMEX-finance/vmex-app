import React from 'react';
import { AppTemplate } from '../ui/templates';
import { MarketsTable } from '../ui/tables';
import { useMarketsData } from '../api/protocol';

const Markets: React.FC = () => {
    const { queryAllMarkets } = useMarketsData();

    return (
        <AppTemplate title="markets">
            <MarketsTable data={queryAllMarkets.data} loading={queryAllMarkets.isLoading} />
        </AppTemplate>
    );
};
export default Markets;
