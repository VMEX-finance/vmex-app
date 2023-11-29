import React from 'react';
import { useDialogController } from '@/hooks';
import {
    BorrowAssetDialog,
    StakeAssetDialog,
    SupplyAssetDialog,
    CreateTrancheDialog,
    ConfirmationDialog,
    FeedbackDialog,
    ToggleCollateralDialog,
    TransactionsDialog,
    ReferralsDialog,
    LeverageAssetDialog,
    TermsOfServiceDialog,
} from '../modals';
import { ModalWrapper } from './subcomponents';

export const AllModalsInstance: React.FC = () => {
    const { getDialogProps } = useDialogController();

    return (
        <>
            <React.Fragment>
                <ModalWrapper {...getDialogProps('tos-dialog')}>
                    <TermsOfServiceDialog {...getDialogProps('tos-dialog')} />
                </ModalWrapper>
            </React.Fragment>

            <React.Fragment>
                <ModalWrapper {...getDialogProps('leverage-asset-dialog')}>
                    <LeverageAssetDialog {...getDialogProps('leverage-asset-dialog')} />
                </ModalWrapper>
            </React.Fragment>

            <React.Fragment>
                <ModalWrapper {...getDialogProps('loan-asset-dialog')}>
                    <SupplyAssetDialog {...getDialogProps('loan-asset-dialog')} />
                </ModalWrapper>
            </React.Fragment>

            <React.Fragment>
                <ModalWrapper {...getDialogProps('borrow-asset-dialog')}>
                    <BorrowAssetDialog {...getDialogProps('borrow-asset-dialog')} />
                </ModalWrapper>
            </React.Fragment>

            <React.Fragment>
                <ModalWrapper {...getDialogProps('stake-asset-dialog')}>
                    <StakeAssetDialog {...getDialogProps('stake-asset-dialog')} />
                </ModalWrapper>
            </React.Fragment>

            <React.Fragment>
                <ModalWrapper {...getDialogProps('create-tranche-dialog')}>
                    <CreateTrancheDialog {...getDialogProps('create-tranche-dialog')} />
                </ModalWrapper>
            </React.Fragment>

            <React.Fragment>
                <ModalWrapper {...getDialogProps('confirmation-dialog')}>
                    <ConfirmationDialog {...getDialogProps('confirmation-dialog')} />
                </ModalWrapper>
            </React.Fragment>

            <React.Fragment>
                <ModalWrapper {...getDialogProps('feedback-dialog')}>
                    <FeedbackDialog {...getDialogProps('feedback-dialog')} />
                </ModalWrapper>
            </React.Fragment>

            <React.Fragment>
                <ModalWrapper {...getDialogProps('toggle-collateral-dialog')}>
                    <ToggleCollateralDialog {...getDialogProps('toggle-collateral-dialog')} />
                </ModalWrapper>
            </React.Fragment>

            <React.Fragment>
                <ModalWrapper {...getDialogProps('transactions-dialog')}>
                    <TransactionsDialog {...getDialogProps('transactions-dialog')} />
                </ModalWrapper>
            </React.Fragment>

            <React.Fragment>
                <ModalWrapper {...getDialogProps('referrals-dialog')}>
                    <ReferralsDialog {...getDialogProps('referrals-dialog')} />
                </ModalWrapper>
            </React.Fragment>
        </>
    );
};
