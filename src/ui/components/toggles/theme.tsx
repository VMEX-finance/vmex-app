import { ThemeContext } from '../../../store';
import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { BasicToggle } from './default';

type IToggleThemeButton = {
    switch?: boolean;
};

const ToggleThemeButton = (props: IToggleThemeButton) => {
    const { theme, setTheme } = React.useContext(ThemeContext);

    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    if (props.switch) {
        const iconSize = 16;
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
                size="large"
            />
        );
    }

    return (
        <div className="transition duration-500 ease-in-out rounded-full p-2">
            {theme === 'dark' ? (
                <FaSun onClick={toggleTheme} className="text-neutral-400 text-2xl cursor-pointer" />
            ) : (
                <FaMoon
                    onClick={toggleTheme}
                    className="text-neutral-400 text-2xl cursor-pointer"
                />
            )}
        </div>
    );
};

export { ToggleThemeButton };
