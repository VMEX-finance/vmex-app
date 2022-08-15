import React, { Fragment } from "react";
import { Dialog, Switch } from "@headlessui/react";
import { IoIosClose } from "react-icons/io";
import { PieChart } from 'react-minimal-pie-chart';
import TranchToggle from "../../components/toggles/RiskProfile";
import { useMediatedState } from "react-use";

interface IOwnedAssetDetails {
    name?: string,
    isOpen?: boolean,
    data?: any,
    closeDialog(e: any): void;
}

type OwnedAssetForm = {
  
}

const inputMediator = (s: string) =>{
   return s.replace(/^0*(?=[1-9])|(^0*(?=0.))/, '')
  }
const OwnedAssetDetails: React.FC<IOwnedAssetDetails> = ({ name, isOpen, data, closeDialog}) => {
  const [amount, setAmount] = useMediatedState(inputMediator, '');
  const [t0, setT0] = React.useState(0);
  const [t1, setT1] = React.useState(0);
  const [t2, setT2] = React.useState(0);

    return (
        data.tranches && <>
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
              <input type="text" value={amount} onChange={(e: any) => setAmount(e.target.value)} className="text-2xl focus:outline-none" placeholder="0.00"/>
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
          <div className="w-full flex flex-row justify-between items-center mt-1 p-2">
              <PieChart 
                data={[
                  { title: 'Tranch 0', value: Number(t0), color: '#000000' },
                  { title: 'Tranch 1', value: Number(t1), color: '#90E7D4' },
                  { title: 'Tranch 2', value: Number(t2), color: '#F35B53' },
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
              <div className="flex flex-col grow">
                <TranchToggle max={1 - Number(t1) + Number(t2)} name="Stable Asset Tranche" value={t0} onChange={(e: any) => setT0(e.target.value)} disabled={data.tranches[0].disabled}/>
                <TranchToggle max={1 - Number(t0) + Number(t2)} name="High Cap Tranche" value={t1} onChange={(e: any) => setT1(e.target.value)} disabled={data.tranches[1].disabled}/>
                <TranchToggle max={1 - Number(t1) + Number(t0)} name="Low Cap Tranche" value={t2} onChange={(e: any) => setT2(e.target.value)} disabled={data.tranches[2].disabled}/>
              </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white focus:outline-none focus:ring-none sm:text-sm hover:text-black hover:bg-white hover:border-[2px] hover:border-black box-border hover:box-border"
              onClick={() => closeDialog('loan-asset-dialog')}
              >
              submit transaction
            </button>
          </div>
        </>
    )
}

export default OwnedAssetDetails;