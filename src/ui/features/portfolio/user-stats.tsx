import React from 'react';
import { Card } from '../../components/cards';
import { useWindowSize } from '../../../hooks/ui';

export interface IPortfolioProps {}

export const PortfolioStatsCard: React.FC<IPortfolioProps> = () => {
    const { width } = useWindowSize();

    return <Card loading={true}></Card>;
};
