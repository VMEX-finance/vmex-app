import React from 'react';
import { Card } from '../components/cards';

// TODO: implement interface
export const ToastNotification = ({ status }: any) => {
    const determineColor = () => {
        switch (status) {
            case 'error':
                return 'bg-red-500 text-white';
            case 'pending':
                return 'bg-blue-300';
            case 'success':
                return 'bg-green-300';
            default:
                return 'bg-neutral-100';
        }
    };

    return (
        <Card className={`fixed w-fit min-w-[300px] bottom-2 right-2 ${determineColor()}`}>
            <span>Notification</span>
        </Card>
    );
};
