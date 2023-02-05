import React from 'react';

type ILegendProps = {
    items: {
        name: string;
        color: `bg-${string}`;
    }[];
};

export const Legend = ({ items }: ILegendProps) => {
    return (
        <div className="flex flex-col items-end">
            <div>
                <span>Legend</span>
            </div>
            <div>
                <ul className="flex gap-3">
                    {items.map((el, i) => (
                        <li key={`legend-item-${i}`} className={`flex items-center gap-1`}>
                            <span className={`w-2 h-2 ${el.color} rounded-full`} />
                            <span className="text-sm font-light">{el.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
