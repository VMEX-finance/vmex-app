import { ThemeContext } from '@/store';
import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { BasicToggle } from './default';
import { useWindowSize } from '@/hooks';

type IToggleThemeButton = {
    switch?: boolean;
};

const ToggleThemeButton = (props: IToggleThemeButton) => {
    const { width, breakpoints } = useWindowSize();
    const { theme, setTheme } = React.useContext(ThemeContext);

    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    if (props.switch) {
        const iconSize = width > breakpoints['2xl'] ? 12 : 10;
        const iconColor = '#525252';
        return (
            <BasicToggle
                colors={['bg-brand-purple', 'bg-neutral-800']}
                checked={theme === 'dark'}
                onChange={toggleTheme}
                customIcon={
                    theme !== 'dark' ? (
                        <FaSun size={iconSize} color={iconColor} />
                    ) : (
                        <FaMoon size={iconSize} color={iconColor} />
                    )
                }
            />
        );
    }

    return (
        <div className="transition duration-500 ease-in-out rounded-full py-2 px-1.5 2xl:px-1">
            {theme === 'dark' ? (
                <FaSun onClick={toggleTheme} className="text-neutral-400 text-xl cursor-pointer" />
            ) : (
                <FaMoon onClick={toggleTheme} className="text-neutral-400 text-xl cursor-pointer" />
            )}
        </div>
    );
};

export { ToggleThemeButton };
