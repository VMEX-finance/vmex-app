import React from 'react';
import { TbInfinity } from 'react-icons/tb';
import { BsArrowRight } from 'react-icons/bs';
import { useUserTrancheData, useTrancheMarketsData } from '../../../api';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { convertStringFormatToNumber, numberFormatter } from '../../../utils/helpers';
import { ethers, BigNumber } from 'ethers';
import { calculateHealthFactorFromBalances, DECIMALS } from '../../../utils/sdk-helpers';
import { useAccount } from 'wagmi';
import { HEALTH } from '../../../utils/constants';

interface IHealthFactorProps {
    asset?: string;
    amount?: string;
    type?: 'supply' | 'withdraw' | 'borrow' | 'repay' | 'no collateral';
    value?: string;
    size?: 'sm' | 'md' | 'lg';
    withChange?: boolean;
    center?: boolean;
}

export const HealthFactor = ({
    asset,
    amount,
    type,
    value,
    size = 'md',
    withChange = true,
    center,
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

    const determineColor = (health: number | string | undefined) => {
        if (!health) return 'text-black';
        let _health;
        if (typeof health === 'string') _health = parseFloat(health);
        else _health = health;

        if (_health > HEALTH['GREAT']) return 'text-brand-green';
        else if (_health > HEALTH['GOOD']) return 'text-green-300';
        else if (_health > HEALTH['OKAY']) return 'text-yellow-400';
        else if (_health > HEALTH['BAD']) return 'text-red-300';
        else return 'text-red-500';
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

    const renderHealth = (hf: number | string | undefined, isInf: boolean) => {
        return isInf || !hf ? (
            <TbInfinity color="#8CE58F" size={`${determineSize()[0]}`} />
        ) : (
            <span className={`${determineSize()[2]} ${determineColor(hf)} font-semibold`}>
                {numberFormatter.format(typeof hf === 'string' ? parseFloat(hf) : hf)}
            </span>
        );
    };

    const determineHFInitial = () => {
        return renderHealth(
            queryUserTrancheData.data?.healthFactor || 0,
            queryUserTrancheData.data?.borrows && queryUserTrancheData.data?.borrows.length != 0
                ? false
                : true,
        );
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

            let totalCollateralETH = queryUserTrancheData.data?.totalCollateralETH;
            let totalDebtInETH = queryUserTrancheData.data?.totalDebtETH;
            let currentLiquidationThreshold =
                queryUserTrancheData.data?.currentLiquidationThreshold;

            if (!totalCollateralETH || !currentLiquidationThreshold || !totalDebtInETH) {
                return undefined;
            }

            let collateralAfter = totalCollateralETH;
            let debtAfter = totalDebtInETH;
            let liquidationThresholdAfter = currentLiquidationThreshold;
            if (type === 'supply') {
                collateralAfter = totalCollateralETH.add(ethAmount);

                if (collateralAfter.gte(a.collateralCap)) {
                    collateralAfter = a.collateralCap;
                }

                let amountIncrease = collateralAfter.sub(totalCollateralETH);

                liquidationThresholdAfter = totalCollateralETH
                    .mul(currentLiquidationThreshold)
                    .add(amountIncrease.mul(a.liquidationThreshold));
            }

            if (type === 'withdraw') {
                let amountCappedNotUsed = ethAmount.gt(a.collateralCap)
                    ? ethAmount.sub(a.collateralCap)
                    : BigNumber.from('0');
                if (ethAmount.lte(amountCappedNotUsed)) {
                    return determineHFInitial();
                }
                let amountDecrease = ethAmount.sub(amountCappedNotUsed);

                collateralAfter = totalCollateralETH.sub(amountDecrease);

                liquidationThresholdAfter = totalCollateralETH
                    .mul(currentLiquidationThreshold)
                    .sub(amountDecrease.mul(a.liquidationThreshold));
            }

            if (type === 'borrow') {
                debtAfter = totalDebtInETH.add(ethAmount);
                liquidationThresholdAfter = currentLiquidationThreshold.mul(totalCollateralETH);
            }

            if (type === 'repay') {
                debtAfter = totalDebtInETH.sub(ethAmount);
                liquidationThresholdAfter = currentLiquidationThreshold.mul(totalCollateralETH);
            }

            let healthFactorAfterDecrease = calculateHealthFactorFromBalances(
                collateralAfter,
                debtAfter,
                liquidationThresholdAfter,
            );

            return renderHealth(
                healthFactorAfterDecrease &&
                    ethers.utils.formatUnits(healthFactorAfterDecrease, 18), //HF always has 18 decimals
                false,
            );
        } catch {
            return undefined;
        }
    };

    return (
        <div>
            <div className={`flex items-center gap-2 ${center ? 'justify-center' : ''}`}>
                {withChange && (
                    <>
                        {determineHFInitial()}
                        <BsArrowRight size={`${determineSize()[1]}`} />
                    </>
                )}
                {withChange ? determineHFFinal() : determineHFInitial()}
            </div>
            {
                <div>
                    <span className="text-xs text-neutral-500 leading-0">{`Liquidation at <1.0`}</span>
                </div>
            }
        </div>
    );
};
