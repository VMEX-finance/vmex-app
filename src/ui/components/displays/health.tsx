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
    PRICING_DECIMALS,
    NETWORKS,
    DEFAULT_NETWORK,
    TESTING,
} from '../../../utils';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { useLocation } from 'react-router-dom';
import { SkeletonLoader } from '../loaders';
import { getNetwork } from '@wagmi/core';

interface IHealthFactorProps {
    asset?: string;
    amount?: string;
    type?: 'supply' | 'withdraw' | 'borrow' | 'repay' | 'disable collateral' | 'enable collateral';
    size?: 'sm' | 'md' | 'lg';
    withChange?: boolean;
    center?: boolean;
    trancheId?: string;
    showInfo?: boolean;
    loader?: 'skeleton' | 'default';
}

export const determineSize = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
        case 'sm':
            return ['24px', '18px', 'text-lg'];
        case 'md':
            return ['30px', '24px', 'text-xl'];
        case 'lg':
            return ['36px', '30px', 'text-2xl'];
    }
};

export const renderHealth = (
    hf: number | string | undefined,
    size: 'sm' | 'md' | 'lg',
    isLoading: boolean,
) => {
    const isInf = Number(hf) > 1.15e59;
    return !hf ? (
        isLoading ? (
            <SkeletonLoader
                variant="rounded"
                width={size === 'sm' ? '50px' : '60px'}
                height={size === 'sm' ? '28px' : '30px'}
            />
        ) : (
            <TbInfinity color="#8CE58F" size={`${determineSize(size)[0]}`} />
        )
    ) : isInf ? (
        <TbInfinity color="#8CE58F" size={`${determineSize(size)[0]}`} />
    ) : Number(hf) > 100 ? (
        <span className={`${determineSize(size)[2]} ${determineHealthColor(hf)} font-semibold`}>
            {'>100'}
        </span>
    ) : (
        <span className={`${determineSize(size)[2]} ${determineHealthColor(hf)} font-semibold`}>
            {HFFormatter.format(typeof hf === 'string' ? parseFloat(hf) : hf)}
        </span>
    );
};

export const HealthFactor = ({
    asset,
    amount,
    type,
    size = 'md',
    withChange = true,
    center,
    trancheId,
    showInfo = true,
    loader = 'default',
}: IHealthFactorProps) => {
    const network = getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;
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

    const determineHFInitial = () => {
        return renderHealth(
            queryUserTrancheData.data?.healthFactor || 0,
            size,
            queryUserTrancheData.isLoading,
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
            let ethAmount;
            if (PRICING_DECIMALS[network] == 8) {
                ethAmount = ethers.utils
                    .parseUnits(convertStringFormatToNumber(amount), d)
                    .mul(a.priceUSD)
                    .div(ethers.utils.parseUnits('1', d)); //18 decimals or 8 decimals
            } else {
                ethAmount = ethers.utils
                    .parseUnits(convertStringFormatToNumber(amount), d)
                    .mul(a.priceETH)
                    .div(ethers.utils.parseUnits('1', d)); //18 decimals or 8 decimals
            }
            if (TESTING) {
                console.log('amount: ', amount);
                console.log('ethAmount: ', ethAmount);
            }

            let totalCollateralETH = queryUserTrancheData.data?.totalCollateralETH;
            let totalDebtInETH = queryUserTrancheData.data?.totalDebtETH; //ETH or USD, depending on underlying chainlink decimals
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
            let liquidationThresholdTimesCollateralAfter =
                currentLiquidationThreshold.mul(totalCollateralETH);
            let borrowFactorTimesDebtAfter = currentAvgBorrowFactor.mul(totalDebtInETH);
            if (type === 'supply') {
                collateralAfter = totalCollateralETH.add(ethAmount);
                liquidationThresholdTimesCollateralAfter =
                    liquidationThresholdTimesCollateralAfter.add(
                        ethAmount.mul(a.liquidationThreshold),
                    );
            }

            if (type === 'withdraw') {
                collateralAfter = totalCollateralETH.sub(ethAmount);
                liquidationThresholdTimesCollateralAfter =
                    liquidationThresholdTimesCollateralAfter.sub(
                        ethAmount.mul(a.liquidationThreshold),
                    );
            }

            if (type === 'borrow') {
                debtAfter = totalDebtInETH.add(ethAmount);
                borrowFactorTimesDebtAfter = borrowFactorTimesDebtAfter.add(
                    ethAmount.mul(a.borrowFactor),
                );
            }

            if (type === 'repay') {
                debtAfter = totalDebtInETH.sub(ethAmount);
                borrowFactorTimesDebtAfter = borrowFactorTimesDebtAfter.sub(
                    ethAmount.mul(a.borrowFactor),
                );
            }
            if (TESTING) {
                console.log('total collateral after calc: ', collateralAfter);
                console.log('total debtAfter after calc: ', debtAfter);
                console.log(
                    'total liquidationThresholdTimesCollateralAfter after calc: ',
                    liquidationThresholdTimesCollateralAfter,
                );
                console.log(
                    'total borrowFactorTimesDebtAfter after calc: ',
                    borrowFactorTimesDebtAfter,
                );
            }

            if (type === 'disable collateral') {
                collateralAfter = totalCollateralETH.sub(ethAmount);
                liquidationThresholdTimesCollateralAfter =
                    liquidationThresholdTimesCollateralAfter.sub(
                        ethAmount.mul(a.liquidationThreshold),
                    );
            }

            if (type === 'enable collateral') {
                collateralAfter = totalCollateralETH.add(ethAmount);
                liquidationThresholdTimesCollateralAfter =
                    liquidationThresholdTimesCollateralAfter.add(
                        ethAmount.mul(a.liquidationThreshold),
                    );
            }
            let healthFactorAfterDecrease = calculateHealthFactorFromBalances(
                borrowFactorTimesDebtAfter,
                liquidationThresholdTimesCollateralAfter, //they both have the same number of decimals
            );

            return renderHealth(
                healthFactorAfterDecrease &&
                    ethers.utils.formatUnits(healthFactorAfterDecrease, 18), //HF always has 18 decimals
                size,
                queryUserTrancheData.isLoading,
            );
        } catch {
            return undefined;
        }
    };

    return (
        <>
            <div className={`flex items-center gap-2 ${center ? 'justify-center' : ''}`}>
                {withChange && (
                    <>
                        {determineHFInitial()}
                        <BsArrowRight size={`${determineSize(size)[1]}`} />
                    </>
                )}
                {withChange ? determineHFFinal() : determineHFInitial()}
            </div>
            {showInfo && (
                <div>
                    <span className="text-xs text-neutral-500 leading-0">{`Liquidation at <1.0`}</span>
                </div>
            )}
        </>
    );
};
