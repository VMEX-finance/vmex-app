import React, { ReactNode } from 'react';

type IModalTableItemProps = {
    label: string;
    value: string | number | ReactNode;
    baseLink?: string;
    loading?: boolean;
};

type IModalTableDisplayProps = {
    title?: string;
    content: IModalTableItemProps[];
};

export const ModalTableDisplay = ({ title, content }: IModalTableDisplayProps) => {
    return (
        <>
            {title && <h3 className="mt-6 text-neutral400">{title}</h3>}
            <div
                className={`mt-2 flex justify-between rounded-lg border border-neutral-300 dark:border-neutral-700 p-4 lg:py-6`}
            >
                <div className="flex flex-col gap-2">
                    {content.map((el, i) => (
                        <span key={i}>{el.label}</span>
                    ))}
                </div>

                <div className="min-w-[100px] flex flex-col gap-2">
                    {content.map((el, i) => (
                        <span
                            key={i}
                            className={`${el.loading ? 'animate-pulse' : ''} ${
                                el.baseLink
                                    ? 'underline text-brand-purple hover:text-opacity-80 duration-200 transition cursor-pointer'
                                    : ''
                            }`}
                        >
                            {el.baseLink ? (
                                <a href={`${el.baseLink}/${el.value}`}>{el.value}</a>
                            ) : (
                                el.value
                            )}
                        </span>
                    ))}
                </div>
            </div>
        </>
    );
};
