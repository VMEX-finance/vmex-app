import { ThemeContext } from '../../../store';
import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ToggleThemeButton = () => {
    const { theme, setTheme } = React.useContext(ThemeContext);

    return (
        <div className="transition duration-500 ease-in-out rounded-full p-2">
            {theme === 'dark' ? (
                <FaSun
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="text-neutral-400 text-2xl cursor-pointer"
                />
            ) : (
                <FaMoon
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="text-neutral-400 text-2xl cursor-pointer"
                />
            )}
        </div>
    );
};

export { ToggleThemeButton };
