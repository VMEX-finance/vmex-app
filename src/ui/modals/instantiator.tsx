import React from 'react';
import { useDialogController } from '../../hooks/dialogs';
import {
    BorrowAssetDialog,
    BorrowedAssetDetailsDialog,
    SuppliedAssetDetailsDialog,
    StakeAssetDialog,
    SupplyAssetDialog,
    CreateTrancheDialog,
    MyTranchesDialog,
} from '../modals';
import { ModalWrapper } from './subcomponents';

export const AllModalsInstance: React.FC = () => {
    const { getDialogProps } = useDialogController();

    return (
        <>
            <React.Fragment>
                <ModalWrapper {...getDialogProps('loan-asset-dialog')}>
                    <SupplyAssetDialog {...getDialogProps('loan-asset-dialog')} />
                </ModalWrapper>
            </React.Fragment>

            <React.Fragment>
                <ModalWrapper {...getDialogProps('borrowed-asset-details-dialog')}>
                    <BorrowedAssetDetailsDialog
                        {...getDialogProps('borrowed-asset-details-dialog')}
                    />
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
                <ModalWrapper {...getDialogProps('supplied-asset-details-dialog')}>
                    <SuppliedAssetDetailsDialog
                        {...getDialogProps('supplied-asset-details-dialog')}
                    />
                </ModalWrapper>
            </React.Fragment>

            <React.Fragment>
                <ModalWrapper {...getDialogProps('create-tranche-dialog')}>
                    <CreateTrancheDialog {...getDialogProps('create-tranche-dialog')} />
                </ModalWrapper>
            </React.Fragment>

            <React.Fragment>
                <ModalWrapper {...getDialogProps('my-tranches-dialog')}>
                    <MyTranchesDialog {...getDialogProps('my-tranches-dialog')} />
                </ModalWrapper>
            </React.Fragment>
        </>
    );
};
