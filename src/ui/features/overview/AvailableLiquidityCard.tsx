import React from 'react';
import { Card } from '../../components/cards';
import { AvailableLiquidityTable } from '../../components/tables';
import { _mockAssetData } from '../../../models/available-liquidity-model';

export const AvailableLiquidityCard: React.FC = () => {
    return (
        <Card>
            <h3 className="text-lg mb-8">Available Liquidity</h3>
            <div>
                <AvailableLiquidityTable data={_mockAssetData.data} />
            </div>
        </Card>
    );
};