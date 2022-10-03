import React from 'react';

interface IGridView {
    children: React.ReactElement | React.ReactElement[];
}

const GridView: React.FC<IGridView> = ({ children }) => {
    return <div className="w-full grid grid-col lg:grid-flow-col-dense gap-8">{children}</div>;
};

export { GridView };
