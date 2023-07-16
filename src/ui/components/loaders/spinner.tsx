import React from 'react';
import { CgSpinner } from 'react-icons/cg';

type ISpinnerLoaderProps = {
    size?: 'lg' | 'md' | 'sm';
    height?: string | 'auto';
    width?: string;
};

export const SpinnerLoader = ({ size, height, width }: ISpinnerLoaderProps) => {
    const determineSize = () => {
        switch (size) {
            case 'lg':
                return '48px';
            case 'sm':
                return '24px';
            default:
                return '36px';
        }
    };

    return (
        <div
            className={`flex justify-center items-center ${height ? height : 'min-h-[200px]'} ${
                width ? width : ''
            }`}
        >
            <CgSpinner className="animate-spin" size={determineSize()} />
        </div>
    );
};
