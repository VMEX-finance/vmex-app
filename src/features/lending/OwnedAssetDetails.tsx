import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoIosClose } from "react-icons/io";

interface IOwnedAssetDetails {
    name?: string,
    isOpen?: boolean,
    data?: any,
    closeDialog(e: any): void;
}

const OwnedAssetDetails: React.FC<IOwnedAssetDetails> = ({ name, isOpen, data, closeDialog}) => {
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