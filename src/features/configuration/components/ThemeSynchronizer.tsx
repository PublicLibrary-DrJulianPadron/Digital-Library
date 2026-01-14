import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectConfiguration } from '../configurationSlice';

export const ThemeSynchronizer = () => {
    const { interfaceColor } = useSelector(selectConfiguration);

    useEffect(() => {
        if (interfaceColor) {
            document.documentElement.style.setProperty('--interface-color', interfaceColor);
        }
    }, [interfaceColor]);

    return null;
};
