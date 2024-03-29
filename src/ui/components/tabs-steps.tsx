import React, { MouseEventHandler, ReactNode } from 'react';

export type IStepperItemProps = {
    name: string;
    status: 'complete' | 'current' | 'upcoming';
};

export type IStepperProps = {
    steps: IStepperItemProps[];
    previous?: MouseEventHandler<HTMLButtonElement>;
    next?: MouseEventHandler<HTMLButtonElement>;
    noSkip?: boolean;
};

export const Stepper = ({ steps, previous, next, noSkip }: IStepperProps) => {
    return (
        <nav aria-label="Progress">
            <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
                {steps.map((step, i) => (
                    <li key={step.name} className="md:flex-1">
                        {step.status === 'complete' ? (
                            <button
                                className="w-full group flex flex-col border-l-4 border-brand-purple py-2 pl-4 hover:border-brand-purple md:border-l-0 md:border-t-4 md:pl-0 md:pb-0 opacity-70 hover:opacity-100 transition duration-100"
                                onClick={previous}
                            >
                                <span className="text-sm font-medium text-brand-purple group-hover:text-brand-purple">{`Step ${
                                    i + 1
                                }`}</span>
                                <span className="text-sm font-medium">{step.name}</span>
                            </button>
                        ) : step.status === 'current' ? (
                            <button
                                className="w-full flex flex-col border-l-4 border-brand-purple py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pb-0"
                                aria-current="step"
                            >
                                <span className="text-sm font-medium text-brand-purple">{`Step ${
                                    i + 1
                                }`}</span>
                                <span className="text-sm font-medium">{step.name}</span>
                            </button>
                        ) : (
                            <button
                                className="w-full group flex flex-col border-l-4 border-gray-200 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pb-0 transition duration-100 hover:border-gray-300"
                                onClick={noSkip ? () => {} : next}
                            >
                                <span className="text-sm font-medium text-neutral500 hover:text-neutral700">{`Step ${
                                    i + 1
                                }`}</span>
                                <span className="text-sm font-medium text-neutral-900 hover:text-brand-black dark:text-neutral-400 dark:hover:text-neutral-300">
                                    {step.name}
                                </span>
                            </button>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export const StepperChild = ({
    children,
    active,
}: {
    children: ReactNode | ReactNode[];
    active: boolean;
}) => (
    <div className={`${active ? 'block' : 'hidden'}`}>
        <>{children}</>
    </div>
);
