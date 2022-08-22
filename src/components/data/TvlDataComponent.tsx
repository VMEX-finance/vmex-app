import React from "react";

export interface ITVLData {
    tvl?: number;
    reserve?: number;
    lenders?: number;
    borrowers?: number;
    markets?: number;
    graphData?: number[];
}

const TVLDataComponent: React.FC<ITVLData> = ({
    tvl,
    reserve,
    lenders,
    borrowers,
    markets,
    graphData
}) => {

    var formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact"
    })
    return (
        <div className="flex flex-col md:flex-row font-basefont gap-8">
            <div className="flex flex-col">
                <h2 className="text-2xl">Total Value Locked (TVL)</h2> 
                <p className="text-3xl">{tvl ? formatter.format(tvl as number) : ""}</p>
            </div>
            <div className="flex md:flex-col justify-between">
                <div className="flex flex-col">
                    <p className="text-sm">Reserves:</p>
                    <p className="text-xl">{reserve ? formatter.format(reserve as number) : ""}</p>
                </div>
                <div className="flex flex-col">
                    <p className="odd:text-sm">Lenders:</p>
                    <p className="text-xl">{lenders}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-sm">Borrowers:</p>
                    <p className="text-xl">{borrowers}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-sm">Markets:</p>
                    <p className="text-xl">{markets}</p>
                </div>
            </div>
        </div>
    )
}
export default TVLDataComponent
