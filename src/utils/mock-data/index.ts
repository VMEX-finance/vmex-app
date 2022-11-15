import { AVAILABLE_ASSETS } from '../constants';
import { MOCK_LINE_DATA } from './chart-data';
import { MOCK_TOP_ASSETS, MOCK_TOP_TRANCHES } from './table-data';

export * from './chart-data';
export * from './table-data';
export * from './tranche-data';

const randomNameGenerator = (num: number) => {
    let res = '';
    for (let i = 0; i < num; i++) {
        const random = Math.floor(Math.random() * 27);
        res += String.fromCharCode(97 + random);
    }
    return `${res[0].toUpperCase()}${res.slice(1)}-${Math.floor(Math.random() * 100)}`;
};

const potentialRatings = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'];

// TODO - implement appropriate type
export const MOCK_PROTOCOL_DATA = {
    tvl: 4600000,
    tvlLineChart: MOCK_LINE_DATA,
    reserves: 822000,
    supplied: 1738000,
    suppliedTopAssets: MOCK_TOP_ASSETS,
    borrowed: 1193000,
    borrowedTopAssets: MOCK_TOP_ASSETS,
    lenders: 426,
    borrowers: 298,
    tranches: 10, // TODO: make dynamic based on tranches length
    tranchesTop5: MOCK_TOP_TRANCHES,
};

export const MOCK_TRANCHES_TABLE_DATA = {
    name: randomNameGenerator(12),
    assets: AVAILABLE_ASSETS.sort((a, b) => 0.5 - Math.random()).slice(
        0,
        Math.floor(Math.random() * 10),
    ),
    rating: potentialRatings[Math.floor(Math.random() * potentialRatings.length)],
    supplied: Math.floor(100000 + Math.random() * 2000000),
    borrowed: Math.floor(100000 + Math.random() * 900000),
};
