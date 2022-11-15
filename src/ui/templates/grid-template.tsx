import React from 'react';

interface IGridViewProps {
    children: React.ReactElement | React.ReactElement[];
    className?: string;
    type?: 'flow' | 'fixed';
    cols?:
        | 'grid-cols-1'
        | 'lg:grid-cols-2'
        | 'md:grid-cols-2'
        | 'lg:grid-cols-3'
        | 'lg:grid-cols-4'
        | 'xl:grid-cols-3'
        | 'xl:grid-cols-4';
}

const GridView: React.FC<IGridViewProps> = ({
    children,
    type = 'flow',
    cols = '2xl:grid-cols-3',
    className = '',
}) => {
    if (type === 'fixed') {
        return (
            <div className={`w-full grid gap-4 md:gap-6 lg:gap-8 ${cols} ${className}`}>
                {children}
            </div>
        );
    } else {
        return (
            <div className={`w-full grid grid-col lg:grid-flow-col-dense gap-8 ${className}`}>
                {children}
            </div>
        );
    }
};

export { GridView };
