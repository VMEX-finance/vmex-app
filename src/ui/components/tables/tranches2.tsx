import React from 'react';
import type { ITrancheProps } from '../../../models/tranches';
import { Button } from '../buttons';
import { useNavigate } from 'react-router-dom';
import { determineRatingColor } from '../../../utils/helpers';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { BsArrowDownCircle, BsArrowUpCircle } from 'react-icons/bs';
import { MultipleAssetsDisplay } from '../displays';
import { useWindowSize } from '../../../hooks/ui';
import { IconTooltip } from '../tooltips/Icon';
import { TableTemplate } from '../../templates';

interface IDataTable {
    data: ITrancheProps[];
}

export const TranchesTableDos: React.FC<IDataTable> = ({ data }) => {
    const navigate = useNavigate();
    const { updateTranche } = useSelectedTrancheContext();
    const { width } = useWindowSize();

    const route = (e: Event, tranche: ITrancheProps, view = 'overview') => {
        e.stopPropagation();
        updateTranche('id', tranche.id);
        navigate(`/tranches/${tranche.name.replace(/\s+/g, '-')}`, { state: { view } });
    };

    const headers = [
        'Tranche',
        'Assets',
        width > 1000 ? 'Aggregate Rating' : 'Rating',
        width > 1000 ? 'Your Activity' : 'Activity',
        'Supplied',
        'Borrowed',
        '',
    ];

    const renderActivity = (status: string) => {
        // TODO: add tooltips to describe what these mean and/or add better icons
        const size = '18px';
        switch (status.toLowerCase()) {
            case 'supplied':
                return <IconTooltip text="Supplying" icon={<BsArrowDownCircle size={size} />} />;
            case 'borrowed':
                return <IconTooltip text="Borrowing" icon={<BsArrowUpCircle size={size} />} />;
            case 'both':
                return (
                    <div className="flex gap-2">
                        <IconTooltip text="Supplying" icon={<BsArrowDownCircle size={size} />} />
                        <IconTooltip text="Borrowing" icon={<BsArrowUpCircle size={size} />} />
                    </div>
                );
            default:
                return <></>;
        }
    };

    const columns = [
        {
            name: 'name',
            label: 'Tranche',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: 'assets',
            label: 'Assets',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: 'aggregateRating',
            label: 'Aggregate Rating',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: 'yourActivity',
            label: 'Your Activity',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: 'supplyTotal',
            label: 'Supplied',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: 'borrowTotal',
            label: 'Borrowed',
            options: {
                filter: true,
                sort: true,
            },
        },
    ];

    return (
        <TableTemplate
            title={['All Available Tranches']}
            columns={columns}
            data={data}
            options={{}}
        />
    );
};
