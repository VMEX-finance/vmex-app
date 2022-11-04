import { Card } from '../ui/components/cards';
import React from 'react';
import { AppTemplate } from '../ui/templates';
import { MarketsTable } from '../ui/components/tables/Markets2';
import { _mockMarketsData } from '../models/markets';
import { TokenData } from '../hooks/user-data';
import { ITokenData } from '../store/token-data';
import { DropdownButton } from '../ui/components/buttons';

const Markets: React.FC = () => {
    const { isLoading, error, error_msg, data }: ITokenData = TokenData();

    return (
        <AppTemplate title="markets">
            <MarketsTable data={_mockMarketsData} />
        </AppTemplate>
    );
};
export default Markets;
