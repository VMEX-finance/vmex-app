import React from 'react';
import { TbInfinity } from 'react-icons/tb';
import { BsArrowRight } from 'react-icons/bs';
import { useUserTrancheData, useTrancheMarketsData } from '../../../api';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { convertStringFormatToNumber } from '../../../utils/helpers';
import { ethers, BigNumber } from 'ethers';
import { DECIMALS } from '../../../utils/sdk-helpers';
import { useAccount } from 'wagmi';

interface IHealthFactorProps {
    asset?: string;
    amount?: string;
    type?: 'supply' | 'withdraw' | 'borrow' | 'repay' | 'no collateral';
    value?: string;
    size?: 'sm' | 'md' | 'lg';
    withChange?: boolean;
}

export const HealthFactor = ({
    asset,
    amount,
    type,
    value,
    size = 'md',
    withChange = true,
}: IHealthFactorProps) => {
    const { address } = useAccount();
    const { tranche } = useSelectedTrancheContext();
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
        return liquidationThreshold
            .mul(ethers.utils.parseEther('1'))
            .div(BigNumber.from('10000'))
            .div(totalDebtInETH);
    };

    const determineHFFinal = () => {
        if (!asset || !amount) {
            return undefined;
        }
        let a = findAssetInMarketsData(asset);
        let d = DECIMALS.get(asset);
        if (!a || !d || amount == '' || !parseFloat(amount)) {
            return undefined;
        }

        try {
            let ethAmount = ethers.utils
                .parseUnits(convertStringFormatToNumber(amount), d)
                .mul(a.currentPrice)
                .div(ethers.utils.parseUnits('1', d)); //18 decimals
            console.log('ethAmount: ', ethAmount);

            let totalCollateralETH = queryUserTrancheData.data?.totalCollateralETH;
            let totalDebtInETH = queryUserTrancheData.data?.totalDebtETH;
            let currentLiquidationThreshold =
                queryUserTrancheData.data?.currentLiquidationThreshold;

            let collateralAfter, liquidationThresholdAfter;

            if (!totalCollateralETH || !currentLiquidationThreshold || !totalDebtInETH) {
                return undefined;
            }
            if (type === 'supply') {
                collateralAfter = totalCollateralETH.add(ethAmount);

                if (collateralAfter.gte(a.collateralCap)) {
                    collateralAfter = a.collateralCap;
                }

                let amountIncrease = collateralAfter.sub(totalCollateralETH);

                liquidationThresholdAfter = totalCollateralETH
                    .mul(currentLiquidationThreshold) //this is sum of all (asset liquidation threshold * asset collateral amount)
                    .add(amountIncrease.mul(a.liquidationThreshold));
                // .div(collateralAfter); //do at later step
            }

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

                collateralAfter = totalCollateralETH.sub(amountDecrease);

                liquidationThresholdAfter = totalCollateralETH
                    .mul(currentLiquidationThreshold)
                    .sub(amountDecrease.mul(a.liquidationThreshold))
                    .div(collateralAfter);
            }

            if (!collateralAfter || !liquidationThresholdAfter) {
                return undefined;
            }

            console.log('collateralBefore: ', totalCollateralETH);
            console.log('collateralAfter: ', collateralAfter);

            console.log('currentLiquidationThreshold: ', currentLiquidationThreshold);
            console.log('liquidationThresholdAfter: ', liquidationThresholdAfter);

            let healthFactorAfterDecrease = calculateHealthFactorFromBalances(
                collateralAfter,
                totalDebtInETH,
                liquidationThresholdAfter,
            );

            return formatHF(
                healthFactorAfterDecrease &&
                    ethers.utils.formatUnits(healthFactorAfterDecrease, 18), //HF always has 18 decimals
                false,
            );
        } catch {
            return undefined;
        }
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
                {withChange ? determineHFFinal() : determineHFInitial()}
            </div>
            {
                <div>
                    <span className="text-sm text-neutral-800">{`Liquidation at <1.0`}</span>
                </div>
            }
        </div>
    );
};
