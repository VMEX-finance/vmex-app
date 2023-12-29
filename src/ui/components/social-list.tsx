import { SOCIALS } from '@/utils';
import React from 'react';

type ISocialList = {
    direction?: 'h' | 'v';
};

export const SocialList = ({ direction = 'h' }: ISocialList) => (
    <ul className={['flex gap-3', direction === 'v' ? 'flex-col' : 'flex-row', ''].join(' ')}>
        {SOCIALS.map((s, i) => (
            <li key={`social-${i}`} className="p-0.5">
                <a
                    target="_blank"
                    href={s.link}
                    rel="noreferrer"
                    className="text-neutral-800 dark:text-neutral-100"
                >
                    <s.icon size={22} />
                </a>
            </li>
        ))}
    </ul>
);
