import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectConfiguration } from '../configurationSlice';

export const ThemeSynchronizer = () => {
    const { interfaceColor, theme } = useSelector(selectConfiguration);

    // Initial Interface Color Sync
    useEffect(() => {
        if (interfaceColor) {
            document.documentElement.style.setProperty('--interface-color', interfaceColor);
        }
    }, [interfaceColor]);

    // Theme Sync (Light / Dark / Auto)
    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = (theme: string) => {
            root.classList.remove("light", "dark");

            if (theme === "auto") {
                const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light";
                root.classList.add(systemTheme);
                return;
            }

            root.classList.add(theme);
        };

        applyTheme(theme);

        // Listen for system theme changes if mode is 'auto'
        if (theme === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme('auto');

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }

    }, [theme]);

    return null;
};
