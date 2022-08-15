import React from "react";
import { Dialog } from "@headlessui/react";
import { IoIosClose } from "react-icons/io";
import { FaGasPump } from "react-icons/fa";
import { useMediatedState } from "react-use";
import Button from "../../components/buttons/Button";
import CoinInput from "../../components/inputs/coin-input";
import ActiveStatus from "../../components/statuses/active";
import DropdownButton from "../../components/buttons/Dropdown";

interface IOwnedAssetDetails {
    name?: string,
    isOpen?: boolean,
    data?: any,
    closeDialog(e: any): void;
}

const inputMediator = (s: string) =>{
   return s.replace(/^0*(?=[1-9])|(^0*(?=0.))/, '')
  }
const BorrowAssetDialog: React.FC<IOwnedAssetDetails> = ({ name, isOpen, data, closeDialog}) => {
  const [amount, setAmount] = useMediatedState(inputMediator, '');

    return (
        data.tranches && <>
          <div className="flex flex-row justify-between">
            <div className="mt-3 text-left sm:mt-5">
              <Dialog.Title as="h3" className="text-xl leading-6 font-medium text-gray-900">
                {name} {data.asset}
              </Dialog.Title>
            </div>
            <div className="self-baseline h-fit w-fit cursor-pointer text-neutral-900 hover:text-neutral-600 transition duration-200" onClick={() => closeDialog('borrow-asset-dialog')}>
              <IoIosClose className="w-7 h-7" />
            </div>
          </div>
          <h3 className="mt-5 text-gray-400">Amount</h3>
          <CoinInput 
            amount={amount}
            setAmount={setAmount}
            coin={{
              logo: data.logo,
              name: data.asset
            }}
            balance={"0.23"}
          />
          <h3 className="mt-6 text-gray-400">Available Collateral</h3>

          <h3 className="mt-6 text-gray-400">Transaction Overview</h3>
          <div className={`mt-2 flex justify-between rounded-lg border border-neutral-900 p-4 lg:py-6`}>
            <div className="flex flex-col gap-2">
              <span>Supply APR%</span>
              <span>Collateralization</span>
              <span>Insurance</span>
            </div>

            <div className="min-w-[100px] flex flex-col gap-2">
              <span>0.44%</span>
              {amount && <ActiveStatus active={true} size="sm" />}
              {amount && <ActiveStatus active={false} size="sm" />}
            </div>
          </div>

          <div className="mt-5 sm:mt-6 flex justify-between items-end">
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <FaGasPump />
                  <span>Gas Limit</span>
                </div>
                <div>
                  <DropdownButton 
                    items={[{ text: "Normal" }, { text: "Low" }, { text: "High" }]}
                  />
                </div>
            </div>
            <div>
              <Button
                onClick={() => closeDialog('borrow-asset-dialog')}
                label="Submit Transaction"
              />
            </div>
          </div>
        </>
    )
}

export default BorrowAssetDialog;