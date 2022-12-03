import React from 'react';
import { TbInfinity } from 'react-icons/tb';
import { BsArrowRight } from 'react-icons/bs';
import { useUserTrancheData, useTrancheMarketsData } from '../../../api';
import { useWalletState } from '../../../hooks/wallet';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { convertStringFormatToNumber } from '../../../utils/helpers';
import { ethers, BigNumber } from 'ethers';
import { DECIMALS } from '../../../utils/sdk-helpers';

interface IHealthFactorProps {
    // initialHF?: number | string;
    // afterHF?: number | string;
    asset: string;
    amount: string;
    type: 'supply' | 'withdraw' | 'borrow' | 'repay' | 'no collateral';
    // liquidation?: number | string;
    size?: 'sm' | 'md' | 'lg';
    withChange?: boolean;
}

export const HealthFactor = ({
    // initialHF,
    // afterHF,
    // liquidation,
    asset,
    amount,
    type,
    size = 'md',
    withChange = true,
}: IHealthFactorProps) => {
    const { address } = useWalletState();
    const { tranche } = useSelectedTrancheContext();
    console.log('ADDRESS: ', address);
    const { queryUserTrancheData } = useUserTrancheData(address, tranche.id);

    const { queryTrancheMarkets } = useTrancheMarketsData(tranche.id);

    const determineSize = () => {
        switch (size) {
            case 'sm':
                return ['24px', '18px', 'text-lg'];
            case 'md':
                return ['30px', '24px', 'text-xl'];
            case 'lg':
                return ['36px', '30px', 'text-2xl'];
        }
    };

    const findAssetInMarketsData = (asset: string) => {
        if (queryTrancheMarkets.isLoading) return undefined;
        else {
            const found = queryTrancheMarkets.data?.find(
                (el) => el.asset.toLowerCase() === asset.toLowerCase(),
            );
            if (found) return found;
            else return undefined;
        }
    };

    const formatHF = (hf: number | string | undefined, isInf: boolean) => {
        return isInf || !hf ? (
            <TbInfinity color="#8CE58F" size={`${determineSize()[0]}`} />
        ) : (
            <span className={`${determineSize()[2]} text-[#D9D001] font-semibold`}>{hf}</span>
        );
    };

    const determineHFInitial = () => {
        return formatHF(
            queryUserTrancheData.data?.healthFactor || 0,
            queryUserTrancheData.data?.borrows ? false : true,
        );
    };

    const calculateHealthFactorFromBalances = (
        totalCollateralInETH: BigNumber,
        totalDebtInETH: BigNumber,
        liquidationThreshold: BigNumber,
    ) => {
        if (totalDebtInETH.eq(BigNumber.from('0'))) {
            return undefined;
        }
        return totalCollateralInETH
            .mul(liquidationThreshold)
            .div(BigNumber.from('10000'))
            .mul(ethers.utils.parseEther('1'))
            .div(totalDebtInETH);
    };

    const determineHFFinal = () => {
        let a = findAssetInMarketsData(asset);
        let d = DECIMALS.get(asset);
        if (!a || !d || amount == '') {
            return undefined;
        }

        let ethAmount = ethers.utils
            .parseUnits(convertStringFormatToNumber(amount), d)
            .mul(a.currentPrice)
            .div(ethers.utils.parseUnits('1', d)); //18 decimals
        console.log();
        console.log();
        console.log();
        console.log('ethAmount: ', ethAmount);

        if (type === 'withdraw') {
            console.log(a.collateralCap);
            let amountCappedNotUsed = ethAmount.gt(a.collateralCap)
                ? ethAmount.sub(a.collateralCap)
                : BigNumber.from('0');
            if (ethAmount.lte(amountCappedNotUsed)) {
                return determineHFInitial();
            }
            console.log('amountCappedNotUsed: ', amountCappedNotUsed);
            let amountDecrease = ethAmount.sub(amountCappedNotUsed);
            let totalCollateralETH = queryUserTrancheData.data?.totalCollateralETH;
            let totalDebtInETH = queryUserTrancheData.data?.totalDebtETH;
            let currentLiquidationThreshold =
                queryUserTrancheData.data?.currentLiquidationThreshold;
            if (!totalCollateralETH || !currentLiquidationThreshold || !totalDebtInETH) {
                return undefined;
            }
            let collateralAfterDecrease = totalCollateralETH.sub(amountDecrease);
            console.log('collateralAfterDecrease: ', collateralAfterDecrease);
            let liquidationThresholdAfterDecrease = totalCollateralETH
                .mul(currentLiquidationThreshold)
                .sub(amountDecrease.mul(a.liquidationThreshold))
                .div(collateralAfterDecrease);

            console.log('liquidationThresholdAfterDecrease: ', liquidationThresholdAfterDecrease);

            let healthFactorAfterDecrease = calculateHealthFactorFromBalances(
                collateralAfterDecrease,
                totalDebtInETH,
                liquidationThresholdAfterDecrease,
            );

            return formatHF(
                healthFactorAfterDecrease && ethers.utils.formatUnits(healthFactorAfterDecrease, d),
                false,
            );
        }
        return queryUserTrancheData.data?.borrows ? (
            <span className={`${determineSize()[2]} text-[#D9D001] font-semibold`}>
                {queryUserTrancheData.data?.healthFactor || 0}
            </span>
        ) : (
            <TbInfinity color="#8CE58F" size={`${determineSize()[0]}`} />
        );
    };
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2">
                {withChange && (
                    <>
                        {determineHFInitial()}
                        <BsArrowRight size={`${determineSize()[1]}`} />
                    </>
                )}
                {/* TODO: color should change based on health value */}
                {determineHFFinal()}
            </div>
            {
                <div>
                    <span className="text-sm text-neutral-800">{`Liquidation at <1.0`}</span>
                </div>
            }
        </div>
    );
};
