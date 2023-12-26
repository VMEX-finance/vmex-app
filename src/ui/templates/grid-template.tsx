import React from 'react';

interface IGridViewProps {
    children: React.ReactElement | React.ReactElement[];
    className?: string;
    type?: 'flow' | 'fixed';
    cols?: string;
}

const GridView: React.FC<IGridViewProps> = ({
    children,
    type = 'flow',
    cols = '2xl:grid-cols-3',
    className = '',
}) => {
    if (type === 'fixed') {
        return <div className={`w-full grid gap-3 ${cols} ${className}`}>{children}</div>;
    } else {
        return (
            <div className={`w-full grid grid-col lg:grid-flow-col-dense gap-3 ${className}`}>
                {children}
            </div>
        );
    }
};

export { GridView };
