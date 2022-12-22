import React from 'react';
import { AppTemplate } from '../ui/templates';
import { MarketsTable } from '../ui/tables';
import { useSubgraphAllMarketsData } from '../api/subgraph';

const Markets: React.FC = () => {
    const { queryAllMarketsData } = useSubgraphAllMarketsData();

    return (
        <AppTemplate title="markets">
            <MarketsTable data={queryAllMarketsData.data} loading={queryAllMarketsData.isLoading} />
        </AppTemplate>
    );
};
export default Markets;
