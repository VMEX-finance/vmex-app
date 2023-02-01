import React from 'react';
import { TbInfinity } from 'react-icons/tb';
import { BsArrowRight } from 'react-icons/bs';
import { useUserTrancheData, useSubgraphTrancheData } from '../../../api';
import { useSelectedTrancheContext } from '../../../store';
import {
    convertStringFormatToNumber,
    HFFormatter,
    calculateHealthFactorFromBalances,
    determineHealthColor,
} from '../../../utils';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { useLocation } from 'react-router-dom';

interface IHealthFactorProps {
    asset?: string;
    amount?: string;
    type?: 'supply' | 'withdraw' | 'borrow' | 'repay' | 'no collateral';
    size?: 'sm' | 'md' | 'lg';
    withChange?: boolean;
    center?: boolean;
    trancheId?: string;
}

export const HealthFactor = ({
    asset,
    amount,
    type,
    size = 'md',
    withChange = true,
    center,
    trancheId,
}: IHealthFactorProps) => {
    const location = useLocation();
    const { address } = useAccount();
    const { tranche } = useSelectedTrancheContext();
    const { queryUserTrancheData } = useUserTrancheData(
        address,
        String(trancheId || location.state?.trancheId || tranche?.id) as any,
    );
    const { findAssetInMarketsData } = useSubgraphTrancheData(
        String(trancheId || location.state?.trancheId || tranche?.id) as any,
    );

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

    const renderHealth = (hf: number | string | undefined, isInf: boolean) => {
        return isInf || !hf ? (
            <TbInfinity color="#8CE58F" size={`${determineSize()[0]}`} />
        ) : Number(hf) > 100 ? (
            <span className={`${determineSize()[2]} ${determineHealthColor(hf)} font-semibold`}>
                {'>100'}
            </span>
        ) : (
            <span className={`${determineSize()[2]} ${determineHealthColor(hf)} font-semibold`}>
                {HFFormatter.format(typeof hf === 'string' ? parseFloat(hf) : hf)}
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
        let d = a?.decimals;
        if (!a || !d || amount == '' || !parseFloat(amount)) {
            return undefined;
        }

        try {
            let ethAmount = ethers.utils
                .parseUnits(convertStringFormatToNumber(amount), d)
                .mul(a.priceETH)
                .div(ethers.utils.parseUnits('1', d)); //18 decimals

            let totalCollateralETH = queryUserTrancheData.data?.totalCollateralETH;
            let totalDebtInETH = queryUserTrancheData.data?.totalDebtETH;
            let currentLiquidationThreshold =
                queryUserTrancheData.data?.currentLiquidationThreshold;
            let currentAvgBorrowFactor = queryUserTrancheData.data?.avgBorrowFactor;

            if (
                !totalCollateralETH ||
                !currentLiquidationThreshold ||
                !totalDebtInETH ||
                !currentAvgBorrowFactor
            ) {
                return undefined;
            }

            let collateralAfter = totalCollateralETH;
            let debtAfter = totalDebtInETH;
            let liquidationThresholdAfter = currentLiquidationThreshold;
            let borrowFactorAfter = currentAvgBorrowFactor;
            if (type === 'supply') {
                collateralAfter = totalCollateralETH.add(ethAmount);
                liquidationThresholdAfter = totalCollateralETH
                    .mul(currentLiquidationThreshold)
                    .add(ethAmount.mul(a.liquidationThreshold));
            }

            if (type === 'withdraw') {
                collateralAfter = totalCollateralETH.sub(ethAmount);
                liquidationThresholdAfter = totalCollateralETH
                    .mul(currentLiquidationThreshold)
                    .sub(ethAmount.mul(a.liquidationThreshold));
            }

            if (type === 'borrow') {
                debtAfter = totalDebtInETH.add(ethAmount);
                liquidationThresholdAfter = currentLiquidationThreshold.mul(totalCollateralETH);
                borrowFactorAfter = totalDebtInETH
                    .mul(currentAvgBorrowFactor)
                    .add(ethAmount.mul(a.borrowFactor));
            }

            if (type === 'repay') {
                debtAfter = totalDebtInETH.sub(ethAmount);
                liquidationThresholdAfter = currentLiquidationThreshold.mul(totalCollateralETH);
                borrowFactorAfter = totalDebtInETH
                    .mul(currentAvgBorrowFactor)
                    .sub(ethAmount.mul(a.borrowFactor));
            }

            let healthFactorAfterDecrease = calculateHealthFactorFromBalances(
                borrowFactorAfter,
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
            <div
                className={`flex items-center gap-2 ${center ? 'justify-center' : ''} ${
                    queryUserTrancheData.isLoading ? 'animate-pulse' : ''
                }`}
            >
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
