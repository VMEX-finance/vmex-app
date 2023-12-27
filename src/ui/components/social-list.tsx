import { SOCIALS } from '@/utils';
import React from 'react';

type ISocialList = {
    direction?: 'h' | 'v';
};

export const SocialList = ({ direction = 'h' }: ISocialList) => (
    <ul className={['flex gap-3', direction === 'v' ? 'flex-col' : 'flex-row', ''].join(' ')}>
        {SOCIALS.map((s, i) => (
            <li key={`social-${i}`}>
                <a
                    target="_blank"
                    href={s.link}
                    rel="noreferrer"
                    className="text-neutral-800 dark:text-neutral-100"
                >
                    <s.icon size={24} />
                </a>
            </li>
        ))}
    </ul>
);
