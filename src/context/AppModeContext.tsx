'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export type AppMode = 'light' | 'full' | 'pro';

interface AppModeConfig {
    mode: AppMode;
    showNavbar: boolean;
    enableBooking: boolean;
    enablePhotoAnalysis: boolean;
    resultDetailLevel: 'summary' | 'detailed' | 'clinical';
    theme: 'minimal' | 'standard' | 'clinical';
}

const DEFAULT_CONFIG: Record<AppMode, AppModeConfig> = {
    light: {
        mode: 'light',
        showNavbar: false,
        enableBooking: false,
        enablePhotoAnalysis: false,
        resultDetailLevel: 'summary',
        theme: 'minimal'
    },
    full: {
        mode: 'full',
        showNavbar: true,
        enableBooking: true,
        enablePhotoAnalysis: false,
        resultDetailLevel: 'detailed',
        theme: 'standard'
    },
    pro: {
        mode: 'pro',
        showNavbar: false, // Kiosk usually hides nav or has specific back buttons
        enableBooking: false, // Immediate service or handled by staff
        enablePhotoAnalysis: true,
        resultDetailLevel: 'clinical',
        theme: 'clinical'
    }
};

interface AppModeContextType extends AppModeConfig {
    setMode: (mode: AppMode) => void;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

export function AppModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<AppMode>('full'); // Default
    const pathname = usePathname();

    // Auto-detect mode from URL
    useEffect(() => {
        if (pathname?.includes('/consult/light')) setMode('light');
        else if (pathname?.includes('/consult/pro')) setMode('pro');
        else if (pathname?.includes('/consult/full')) setMode('full');
        // Keep current mode if navigating within sub-routes or default to full
    }, [pathname]);

    const config = DEFAULT_CONFIG[mode];

    return (
        <AppModeContext.Provider value={{ ...config, setMode }}>
            {/* Data attribute allows CSS to target specific modes easily */}
            <div data-mode={mode} className="app-mode-wrapper min-h-screen transition-colors duration-500">
                {children}
            </div>
        </AppModeContext.Provider>
    );
}

export function useAppMode() {
    const context = useContext(AppModeContext);
    if (context === undefined) {
        throw new Error('useAppMode must be used within an AppModeProvider');
    }
    return context;
}
