import React, { ReactNode, FC } from 'react';

type IModalFooterProps = {
    children: ReactNode | ReactNode[];
    between?: boolean;
};

export const ModalFooter: FC<IModalFooterProps> = ({ children, between }) => {
    return (
        <div
            className={`w-full mt-3 2xl:mt-4 flex gap-3 ${
                between ? 'justify-between' : 'justify-end'
            } items-end`}
        >
            {children}
        </div>
    );
};
