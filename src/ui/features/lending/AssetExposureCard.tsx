import React from "react";
import { _mockTrancheAssetExposure, _mockTrancheAssetExposure2, _mockTrancheAssetExposure3 } from "@models/asset-exposure-model";
import { Tab } from "@headlessui/react";
import { Card } from "../../components/cards/default";
import { AssetExposureTable } from "@ui/components/tables";

const AssetExposureCard: React.FC = () => {
    return (
        <Card>
            <h3 className="text-lg mb-8">Your Asset Exposures</h3>
            <div>
                <Tab.Group>
                    <Tab.List className="mb-3 text-sm text-right">
                        <Tab className="mx-2">
                            {
                                ({selected}) => (
                                    <button className={
                                        [(selected ? "p-2 rounded-lg bg-white text-black border-black border-[2px]" : "p-3 rounded-lg bg-gray-100 text-gray-400")].join(" ")
                                    }> Tranch 0</button>
                                )
                            }    
                        </Tab>
                        <Tab className="mx-2">
                            {
                                ({selected}) => (
                                    <button className={
                                        [(selected ? "p-2 rounded-lg bg-white text-black border-black border-[2px]" : "p-3 rounded-lg bg-gray-100 text-gray-400")].join(" ")
                                    }> Tranch 0</button>
                                )
                            }    
                        </Tab>
                        <Tab className="mx-2">
                            {
                                ({selected}) => (
                                    <button className={
                                        [(selected ? "p-2 rounded-lg bg-white text-black border-black border-[2px]" : "p-3 rounded-lg bg-gray-100 text-gray-400")].join(" ")
                                    }> Tranch 0</button>
                                )
                            }    
                        </Tab>
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel>
                            <AssetExposureTable data={_mockTrancheAssetExposure}/>
                        </Tab.Panel>
                        <Tab.Panel>
                            <AssetExposureTable data={_mockTrancheAssetExposure2}/>
                        </Tab.Panel>
                        <Tab.Panel>
                            <AssetExposureTable data={_mockTrancheAssetExposure3}/>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </Card>
    )
}

export default AssetExposureCard;