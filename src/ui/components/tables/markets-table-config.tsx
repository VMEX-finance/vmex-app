import { MUIDataTableColumn, MUIDataTableOptions } from 'mui-datatables';
import React from 'react';

import { MarketsCustomRow } from './markets-custom-row';

export const options: MUIDataTableOptions = {
    download: false,
    print: false,
    viewColumns: false,
    selectableRowsHeader: false,
    selectableRowsHideCheckboxes: true,
    searchPlaceholder: 'Search...',
    customRowRender: (data) => {
        const [
            asset,
            tranche,
            supplyApy,
            borrowApy,
            yourAmount,
            available,
            supplyTotal,
            borrowTotal,
            rating,
            strategies,
            logo,
            trancheId,
        ] = data;

        return (
            <MarketsCustomRow
                asset={asset}
                tranche={tranche}
                trancheId={trancheId}
                supplyApy={supplyApy}
                borrowApy={borrowApy}
                yourAmount={yourAmount}
                available={available}
                borrowTotal={borrowTotal}
                supplyTotal={supplyTotal}
                rating={rating}
                strategies={strategies}
                logo={logo}
            />
        );
    },
    searchOpen: true,
};
