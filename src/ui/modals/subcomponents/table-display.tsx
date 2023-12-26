import React, { ReactNode } from 'react';
import { Tooltip, Loader, Card } from '@/ui/components';

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
                return ['text-sm', 'gap-0.5'];
            default:
                return ['text-md', 'gap-0.5'];
        }
    };
    return (
        <>
            {title && <h3 className="mt-3 2xl:mt-4 mb-0.5">{title}</h3>}
            <Card type="inner-outline">
                <div
                    className={`${
                        content?.length ? 'justify-between' : 'justify-center'
                    } flex rounded-lg ${determineSize()[0]}`}
                >
                    {loading ? (
                        <>
                            <Loader height="auto" size="sm" type="spinner" />
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
                                        className={`min-w-[100px] flex flex-col ${
                                            determineSize()[1]
                                        }`}
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
            </Card>
        </>
    );
};
