import React from 'react';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeaderV2 } from '../subcomponents';
import { Button } from '../../components';

export const DisclaimerDialog: React.FC<IDialogProps> = ({ name, isOpen, data, closeDialog }) => {
    return (
        <>
            <ModalHeaderV2 dialog="disclaimer-dialog" tabs={['Disclaimer']} />

            <div className="py-8 flex flex-col gap-4">
                <div>
                    <p></p>
                </div>
            </div>

            <ModalFooter>
                <Button primary disabled={false} onClick={() => {}} label="I Agree" />
            </ModalFooter>
        </>
    );
};
