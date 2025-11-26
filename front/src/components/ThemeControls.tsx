'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Eye, EyeOff } from 'lucide-react';

export function ThemeControls() {
    const { theme, viewMode, toggleTheme, toggleViewMode } = useTheme();

    return (
        <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="p-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 transition-all hover:shadow-md flex items-center gap-2"
                title={theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
            >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Focus Mode Toggle */}
            <button
                onClick={toggleViewMode}
                className={`p-2 border-2 rounded-xl transition-all hover:shadow-md flex items-center gap-2 ${viewMode === 'focus'
                        ? 'bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                    }`}
                title={viewMode === 'focus' ? 'Modo Normal' : 'Modo Focus'}
            >
                {viewMode === 'focus' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
        </div>
    );
}
