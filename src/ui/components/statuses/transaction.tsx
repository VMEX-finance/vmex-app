import React from 'react';
import { BsCheck } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';

interface ISuccessStatus {
    success: boolean;
    size?: 'sm' | 'md' | 'lg';
    full?: boolean;
}

export const TransactionStatus = ({ success, size, full }: ISuccessStatus) => {
    const determineSize = () => {
        if (full) {
            return '60px';
        } else {
            switch (size) {
                case 'lg':
                    return '36px';
                case 'sm':
                    return '24px';
                default:
                    return '30px';
            }
        }
    };

    const determineColor = () => {
        if (success) return 'text-emerald-600';
        return 'text-red-600';
    };

    return (
        <div
            className={`${determineColor()} flex items-center ${
                full ? 'flex-col justify-center min-h-[300px]' : ''
            }`}
        >
            <div>
                {success ? (
                    <BsCheck size={determineSize()} />
                ) : (
                    <IoIosClose size={determineSize()} />
                )}
            </div>
            <span className={`${full ? 'text-lg' : ''}`}>{success ? 'Success' : 'Error'}</span>
        </div>
    );
};
