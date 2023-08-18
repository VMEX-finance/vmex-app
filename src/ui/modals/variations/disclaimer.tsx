import React from 'react';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader } from '../subcomponents';
import { Button } from '../../components';

export const DisclaimerDialog: React.FC<IDialogProps> = ({ name, isOpen, data, closeDialog }) => {
    return (
        <>
            <ModalHeader dialog="disclaimer-dialog" tabs={['Disclaimer']} />

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
