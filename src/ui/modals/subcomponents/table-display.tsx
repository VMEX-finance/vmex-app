import { SpinnerLoader } from '../../components/loaders';
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
    noData?: {
        text: string;
        ctaText?: string;
        ctaLink?: string;
    };
    loading?: boolean;
};

export const ModalTableDisplay = ({ title, content, noData, loading }: IModalTableDisplayProps) => {
    return (
        <>
            {title && <h3 className="mt-6">{title}</h3>}
            <div
                className={`${
                    content?.length ? 'justify-between' : 'justify-center'
                } mt-2 flex rounded-lg border border-neutral-300 dark:border-neutral-700 p-4 lg:py-6`}
            >
                {loading ? (
                    <>
                        <SpinnerLoader height="auto" size="sm" />
                    </>
                ) : (
                    <>
                        {content?.length ? (
                            <>
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
