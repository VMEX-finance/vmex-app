import { IStepperItemProps } from '@/ui/components';
import { useState } from 'react';

// Hook
export function useStepper(_steps: IStepperItemProps[]) {
    const [steps, setSteps] = useState<IStepperItemProps[]>(_steps);
    const [activeStep, setActiveStep] = useState(0);

    const nextStep = () => {
        const shallow = [...steps];
        const current = shallow.findIndex((el) => el.status === 'current');
        if ((current || current === 0) && current !== shallow.length - 1)
            shallow[current].status = 'complete';
        const next = current + 1;
        if (next < shallow.length) {
            shallow[next].status = 'current';
            setActiveStep(activeStep + 1);
        }
        setSteps(shallow);
    };

    const prevStep = () => {
        const shallow = [...steps];
        const current = shallow.findIndex((el) => el.status === 'current');
        if (current) shallow[current].status = 'upcoming';
        const prev = current - 1;
        if (prev >= 0) {
            shallow[prev].status = 'current';
            setActiveStep(activeStep - 1);
        }
        setSteps(shallow);
    };

    return {
        steps,
        activeStep,
        nextStep,
        prevStep,
    };
}
