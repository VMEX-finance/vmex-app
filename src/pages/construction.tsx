import React from 'react';
import { Base } from '@/ui/base';
import { Button } from '@/ui/components/button';

const Construction: React.FC = () => {
    return (
        <Base title="Under Construction">
            <div className="bg-white dark:bg-brand-black p-6">
                <span className="dark:text-neutral-300">{"We're working on it!"}</span>
                <Button type="accent">Button</Button>
            </div>
        </Base>
    );
};
export default Construction;
