import React, { ReactNode } from 'react';
import { Tooltip, SpinnerLoader } from '@/ui/components';

type IModalTableItemProps = {
    label: string;
    value: string | number | ReactNode;
    baseLink?: string;
    loading?: boolean;
    error?: string;
};

type IModalTableDisplayProps = {
    title?: string;
    content: IModalTableItemProps[];
    noData?: {
        text: string;
        ctaText?: string;
        ctaLink?: string;
    };
    loading?: boolean;
    valueClass?: string;
    size?: 'sm' | 'md';
};

export const ModalTableDisplay = ({
    title,
    content,
    noData,
    loading,
    valueClass,
    size = 'md',
}: IModalTableDisplayProps) => {
    const determineSize = () => {
        switch (size) {
            case 'sm':
                return ['text-sm', 'gap-0.5', 'mt-1'];
            default:
                return ['text-md', 'gap-1.5', 'mt-2'];
        }
    };
    return (
        <>
            {title && <h3 className="mt-3 2xl:mt-4">{title}</h3>}
            <div
                className={`${content?.length ? 'justify-between' : 'justify-center'} ${
                    determineSize()[2]
                } flex rounded-lg border border-neutral-300 dark:border-neutral-700 px-4 py-2 ${
                    determineSize()[0]
                }`}
            >
                {loading ? (
                    <>
                        <SpinnerLoader height="auto" size="sm" />
                    </>
                ) : (
                    <>
                        {content?.length ? (
                            <>
                                <div className={`flex flex-col ${determineSize()[1]}`}>
                                    {content.map((el, i) => (
                                        <span key={i}>{el.label}</span>
                                    ))}
                                </div>

                                <div
                                    className={`min-w-[100px] flex flex-col ${determineSize()[1]}`}
                                >
                                    {content.map((el, i) => (
                                        <span
                                            key={i}
                                            className={`${valueClass} ${
                                                el.loading ? 'animate-pulse' : ''
                                            } ${
                                                el.baseLink
                                                    ? 'underline text-brand-purple hover:text-opacity-80 duration-200 transition cursor-pointer'
                                                    : ''
                                            }`}
                                        >
                                            {el.error && el.error != '' ? (
                                                <Tooltip text={el.error}>
                                                    Transaction likely to revert
                                                </Tooltip>
                                            ) : el.baseLink ? (
                                                <a href={`${el.baseLink}/${el.value}`}>
                                                    {el.value}
                                                </a>
                                            ) : (
                                                el.value
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col justify-center items-center">
                                <span className="text-center">
                                    {noData?.text || 'No Data Available'}
                                </span>
                                {noData?.ctaLink && noData?.ctaText && (
                                    <a href={`/#${noData.ctaLink}`}>{noData.ctaText}</a>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};
