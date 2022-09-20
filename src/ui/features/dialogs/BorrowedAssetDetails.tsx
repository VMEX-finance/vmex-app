import React from "react";
import { Dialog } from "@headlessui/react";
import { IoIosClose } from "react-icons/io";
import { MdCompareArrows, MdOutlineArrowForward } from "react-icons/md";
import { useMediatedState } from "react-use";
import { Button } from "../../components/buttons";
import { TransactionStatus } from "../../components/statuses";
import { AssetDisplay } from "../../components/displays";
import { inputMediator } from "../../../utils/helpers";

interface IOwnedAssetDetails {
    name?: string,
    isOpen?: boolean,
    data?: any,
    closeDialog(e: any): void;
}

export const BorrowedAssetDetailsDialog: React.FC<IOwnedAssetDetails> = ({ name, isOpen, data, closeDialog}) => {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const [amount, setAmount] = useMediatedState(inputMediator, '');

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
          {!isSuccess && !isError ? (
            // Default State
            <>
              <h3 className="mt-5 text-gray-400">Overview</h3>
              <div className="grid grid-cols-3 items-center">
                <div className="flex flex-col">
                  <AssetDisplay 
                    name={data.asset} 
                    logo={`/tokens/token-${data.asset.toUpperCase()}.svg`} 
                    className="mb-1"
                  />
                  <span>{130.2} {data.asset.toUpperCase()} Borrowed</span>
                  <span className="text-sm text-neutral-500">${"156,240.02"} USD</span>
                </div>
                <MdCompareArrows className="justify-self-center" size="32px" />
                <div className="flex flex-col">
                  <AssetDisplay 
                    name={"USDC"} 
                    logo={`/tokens/token-${"USDC"}.svg`} 
                    className="mb-1"
                  />
                  <span>{"156,241.1"} {"USDC"} Collatoralized</span>
                  <span className="text-sm text-neutral-500">${"156,240.02"} USD</span>
                </div>
              </div>

              <h3 className="mt-6 text-gray-400">Loan Details</h3>
              <div className={`mt-2 flex justify-between rounded-lg border border-neutral-900 p-4 lg:py-6`}>
                <div className="flex flex-col gap-2">
                  <span>Interest Rate</span>
                  <span>Date Borrowed</span>
                  <span>Interest Accrued</span>
                  <span>TX Hash</span>
                </div>

                <div className="min-w-[100px] flex flex-col gap-2">
                  <span>{0.44}%</span>
                  <span>12-23-2022 | 13:05</span>
                  <span>${13.56}</span>
                  <span className="underline text-brand-purple cursor-pointer">
                    <a href="/borrowing">
                      {"0x932...2134"}
                    </a>
                  </span>
                </div>
              </div>

              <h3 className="mt-6 text-gray-400">Price Analytics</h3>
              <div className="grid gap-2">
                <div className="min-h-[100px]">

                </div>
              </div>
            </>
          ) : isSuccess ? (
            // Success State
            <div className="mt-10 mb-8">
              <TransactionStatus success={true} full />
            </div>
          ) : (
            // Error State
            <div className="mt-10 mb-8">
              <TransactionStatus success={false} full />
            </div>
          )}

          <div className="mt-5 sm:mt-6">
            <Button
                onClick={() => {
                  setIsSuccess(true);

                  setTimeout(() => {
                    setIsSuccess(false);
                    closeDialog('borrowed-asset-details-dialog');
                  }, 2000);
                }}
                label={
                  <span className="flex items-center gap-2">
                    Repay Loan <MdOutlineArrowForward />
                  </span>
                }
              />
          </div>
        </>
    )
}