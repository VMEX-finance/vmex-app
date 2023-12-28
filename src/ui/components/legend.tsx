import React from 'react';
import { Tooltip } from './tooltip-default';

type ILegendProps = {
    items: {
        name: string;
        color: `bg-${string}`;
    }[];
    compact?: boolean;
};

export const Legend = ({ items, compact }: ILegendProps) => {
    return (
        <div className="flex flex-col items-end">
            <div>
                <span>Legend</span>
            </div>
            <div>
                <ul className="flex gap-2 xl:gap-3">
                    {items.map((el, i) => (
                        <li key={`legend-item-${i}`} className={`flex items-center gap-1`}>
                            {compact ? (
                                <Tooltip text={el.name}>
                                    <span className={`w-2 h-2 ${el.color} rounded-full`} />
                                </Tooltip>
                            ) : (
                                <>
                                    <span className="text-sm font-light">{el.name}</span>
                                    <span className={`w-2 h-2 ${el.color} rounded-full`} />
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
