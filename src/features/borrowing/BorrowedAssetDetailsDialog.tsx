import React from "react";
import { Dialog } from "@headlessui/react";
import { IoIosClose } from "react-icons/io";
import { PieChart } from 'react-minimal-pie-chart';
import TranchToggle from "../../components/toggles/RiskProfile";
import { useMediatedState } from "react-use";
import CoinInput from "../../components/inputs/coin-input";
import Button from "../../components/buttons/Button";

interface IOwnedAssetDetails {
    name?: string,
    isOpen?: boolean,
    data?: any,
    closeDialog(e: any): void;
}

const inputMediator = (s: string) =>{
   return s.replace(/^0*(?=[1-9])|(^0*(?=0.))/, '')
  }
const BorrowedAssetDetailsDialog: React.FC<IOwnedAssetDetails> = ({ name, isOpen, data, closeDialog}) => {
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
            </div>
            <div className="self-baseline h-fit w-fit cursor-pointer text-neutral-900 hover:text-neutral-600 transition duration-200" onClick={() => closeDialog("borrowed-asset-details-dialog")}>
              <IoIosClose className="w-7 h-7" />
            </div>
          </div>
          <h3 className="mt-5 text-gray-400">Overview</h3>

          <h3 className="mt-6 text-gray-400">Loan Details</h3>
          <div className="w-full flex flex-row justify-between items-center mt-1 p-2">

          </div>

          <h3 className="mt-6 text-gray-400">Price Analytics</h3>

          <div className="mt-5 sm:mt-6">
            <Button
                onClick={() => closeDialog('loan-asset-dialog')}
                label="Submit Transaction"
              />
          </div>
        </>
    )
}

export default BorrowedAssetDetailsDialog;