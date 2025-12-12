'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type ViewMode = 'normal' | 'focus';

interface ThemeContextType {
    theme: Theme;
    viewMode: ViewMode;
    toggleTheme: () => void;
    toggleViewMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');
    const [viewMode, setViewMode] = useState<ViewMode>('normal');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        const savedViewMode = localStorage.getItem('viewMode') as ViewMode | null;

        if (savedTheme) setTheme(savedTheme);
        if (savedViewMode) setViewMode(savedViewMode);
    }, []);

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.classList.remove('normal-mode', 'focus-mode');
        document.documentElement.classList.add(viewMode === 'focus' ? 'focus-mode' : 'normal-mode');
        localStorage.setItem('viewMode', viewMode);
    }, [viewMode]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const toggleViewMode = () => {
        setViewMode(prev => prev === 'normal' ? 'focus' : 'normal');
    };

    return (
        <ThemeContext.Provider value={{ theme, viewMode, toggleTheme, toggleViewMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
