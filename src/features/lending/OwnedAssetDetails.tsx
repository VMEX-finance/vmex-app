import React, { Fragment } from "react";
import { Dialog, Switch } from "@headlessui/react";
import { IoIosClose } from "react-icons/io";
import { PieChart } from 'react-minimal-pie-chart';

interface IOwnedAssetDetails {
    name?: string,
    isOpen?: boolean,
    data?: any,
    closeDialog(e: any): void;
}

const OwnedAssetDetails: React.FC<IOwnedAssetDetails> = ({ name, isOpen, data, closeDialog}) => {
  const [enabled, setEnabled] = React.useState(false)
  
  console.log(data)
    return (
        <>
          <div className="flex flex-row justify-between">
            <div className="mt-3 text-left sm:mt-5">
              <Dialog.Title as="h3" className="text-xl leading-6 font-medium text-gray-900">
                {name} {data.asset}
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Please be aware when lending an asset...
                </p>
              </div>
            </div>
            <div className="self-baseline h-fit w-fit" onClick={() => closeDialog('loan-asset-dialog')}>
              <IoIosClose className="w-7 h-7"/>
            </div>
          </div>
          <h1 className="mt-5 text-gray-400">Amount</h1>
          <div className="w-full flex flex-row justify-between mt-1 rounded-xl border border-gray-300 p-2">
            <div className="flex flex-col justify-between gap-3">
              <input type="text" className="text-2xl focus:outline-none" placeholder="0.00"/>
              <div className="text-gray-400">USD</div>
            </div>
            <div className="flex flex-col justify-between gap-3">
              <div className="flex gap-1"><img src={data.logo} />{data.asset}</div>
              <div className="text-xs text-right text-blue-700">
                <p>MAX</p>
                <p>0.3213</p>
              </div>
            </div>
          </div>
          <h1 className="mt-6 text-gray-400">Risk Profile Selection</h1>
          <div className="w-full flex flex-row justify-between mt-1 p-2">
              <PieChart 
                data={[
                  { title: 'Tranch 0', value: 58, color: '#000000' },
                  { title: 'Tranch 1', value: 32, color: '#90E7D4' },
                  { title: 'Tranch 2', value: 10, color: '#F35B53' },
                ]}
                className="w-[150px] h-[150px]"
                animate
                lineWidth={50}
                center={[60, 60]}
                viewBoxSize={[120, 120]}
                label={({ dataEntry, dataIndex }) => {
                  return dataEntry.percentage > 0? `T${dataIndex}` : ``
                }}
                labelPosition={100 - 50 / 2}
                labelStyle={{
                  fill: '#fff',
                  opacity: 1,
                  pointerEvents: 'none',
                  fontSize: '10px'
                }}
              />
              <div className="flex flex-col">
                <div>
                  <p>Tranch 0</p>
                  <Switch 
                    checked
                    onChange={setEnabled}
                    className={`${
                      enabled ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Enable notifications</span>
                    <span
                      className={`${
                        enabled ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white`}
                    />
                  </Switch>
                </div>
              </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white focus:outline-none focus:ring-none sm:text-sm hover:text-black hover:bg-white hover:border-[2px] hover:border-black box-border hover:box-border"
              onClick={() => closeDialog('loan-asset-dialog')}
              >
              go back to dashboard
            </button>
          </div>
        </>
    )
}

export default OwnedAssetDetails;