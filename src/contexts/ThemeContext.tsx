import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeVariant = 'explorer' | 'immersive' | 'ios26' | 'android16';
export type ThemeCornerStyle = 'soft' | 'sharp';
export type ThemeIconStyle = 'lucide' | 'lucide-bold' | 'iconify';
export type ThemeAppearanceMode = 'dark' | 'light';

const THEMES: ThemeVariant[] = ['explorer', 'immersive', 'ios26', 'android16'];
const CORNER_STYLES: ThemeCornerStyle[] = ['soft', 'sharp'];
const ICON_STYLES: ThemeIconStyle[] = ['lucide', 'lucide-bold', 'iconify'];
const APPEARANCE_MODES: ThemeAppearanceMode[] = ['dark', 'light'];

interface ThemeContextType {
    theme: ThemeVariant;
    setTheme: (theme: ThemeVariant) => void;
    animationsEnabled: boolean;
    setAnimationsEnabled: (enabled: boolean) => void;
    glassEffectsEnabled: boolean;
    setGlassEffectsEnabled: (enabled: boolean) => void;
    cornerStyle: ThemeCornerStyle;
    setCornerStyle: (style: ThemeCornerStyle) => void;
    iconStyle: ThemeIconStyle;
    setIconStyle: (style: ThemeIconStyle) => void;
    appearanceMode: ThemeAppearanceMode;
    setAppearanceMode: (mode: ThemeAppearanceMode) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'wanderer-theme';
const THEME_MOTION_KEY = 'wanderer-theme-motion';
const THEME_GLASS_KEY = 'wanderer-theme-glass';
const THEME_CORNER_KEY = 'wanderer-theme-corner';
const THEME_ICON_STYLE_KEY = 'wanderer-theme-icon-style';
const THEME_APPEARANCE_KEY = 'wanderer-theme-appearance';

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: ThemeVariant;
}

export function ThemeProvider({ children, defaultTheme = 'explorer' }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<ThemeVariant>(() => {
        // Try to get saved theme from localStorage
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeVariant | null;
            if (saved && THEMES.includes(saved)) {
                return saved;
            }
        }
        return defaultTheme;
    });
    const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(() => {
        if (typeof window === 'undefined') return true;
        const saved = localStorage.getItem(THEME_MOTION_KEY);
        if (saved === null) return true;
        return saved === 'true';
    });
    const [glassEffectsEnabled, setGlassEffectsEnabledState] = useState<boolean>(() => {
        if (typeof window === 'undefined') return true;
        const saved = localStorage.getItem(THEME_GLASS_KEY);
        if (saved === null) return true;
        return saved === 'true';
    });
    const [cornerStyle, setCornerStyleState] = useState<ThemeCornerStyle>(() => {
        if (typeof window === 'undefined') return 'soft';
        const saved = localStorage.getItem(THEME_CORNER_KEY) as ThemeCornerStyle | null;
        if (saved && CORNER_STYLES.includes(saved)) {
            return saved;
        }
        return 'soft';
    });
    const [iconStyle, setIconStyleState] = useState<ThemeIconStyle>(() => {
        if (typeof window === 'undefined') return 'lucide';
        const saved = localStorage.getItem(THEME_ICON_STYLE_KEY) as ThemeIconStyle | null;
        if (saved && ICON_STYLES.includes(saved)) {
            return saved;
        }
        return 'lucide';
    });
    const [appearanceMode, setAppearanceModeState] = useState<ThemeAppearanceMode>(() => {
        if (typeof window === 'undefined') return 'dark';
        const saved = localStorage.getItem(THEME_APPEARANCE_KEY) as ThemeAppearanceMode | null;
        if (saved && APPEARANCE_MODES.includes(saved)) {
            return saved;
        }
        return 'dark';
    });

    useEffect(() => {
        // Save theme preferences to localStorage
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        localStorage.setItem(THEME_MOTION_KEY, String(animationsEnabled));
        localStorage.setItem(THEME_GLASS_KEY, String(glassEffectsEnabled));
        localStorage.setItem(THEME_CORNER_KEY, cornerStyle);
        localStorage.setItem(THEME_ICON_STYLE_KEY, iconStyle);
        localStorage.setItem(THEME_APPEARANCE_KEY, appearanceMode);

        // Update document classes for theme + visual preferences
        const root = document.documentElement;
        root.classList.remove(
            'theme-explorer',
            'theme-immersive',
            'theme-ios26',
            'theme-android16',
            'theme-no-motion',
            'theme-no-glass',
            'theme-corners-soft',
            'theme-corners-sharp',
            'theme-icons-lucide',
            'theme-icons-lucide-bold',
            'theme-icons-iconify',
            'theme-mode-dark',
            'theme-mode-light'
        );
        root.classList.add(`theme-${theme}`);
        root.classList.add(`theme-corners-${cornerStyle}`);
        root.classList.add(`theme-icons-${iconStyle}`);
        const modeForTheme =
            theme === 'explorer' || theme === 'immersive' ? 'dark' : appearanceMode;
        root.classList.add(`theme-mode-${modeForTheme}`);
        if (!animationsEnabled) {
            root.classList.add('theme-no-motion');
        }
        if (!glassEffectsEnabled) {
            root.classList.add('theme-no-glass');
        }

        if (modeForTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme, animationsEnabled, glassEffectsEnabled, cornerStyle, iconStyle, appearanceMode]);

    const setTheme = (newTheme: ThemeVariant) => {
        setThemeState(newTheme);
    };
    const setAnimationsEnabled = (enabled: boolean) => {
        setAnimationsEnabledState(enabled);
    };
    const setGlassEffectsEnabled = (enabled: boolean) => {
        setGlassEffectsEnabledState(enabled);
    };
    const setCornerStyle = (style: ThemeCornerStyle) => {
        setCornerStyleState(style);
    };
    const setIconStyle = (style: ThemeIconStyle) => {
        setIconStyleState(style);
    };
    const setAppearanceMode = (mode: ThemeAppearanceMode) => {
        setAppearanceModeState(mode);
    };

    const toggleTheme = () => {
        setThemeState(prev => THEMES[(THEMES.indexOf(prev) + 1) % THEMES.length]);
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                animationsEnabled,
                setAnimationsEnabled,
                glassEffectsEnabled,
                setGlassEffectsEnabled,
                cornerStyle,
                setCornerStyle,
                iconStyle,
                setIconStyle,
                appearanceMode,
                setAppearanceMode,
                toggleTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

// Export theme-specific values for components that need programmatic access
export const themeConfig = {
    explorer: {
        name: 'Explorer',
        description: 'Spacedrive-inspired file manager style',
        icon: 'Folder',
    },
    immersive: {
        name: 'Immersive',
        description: 'Cinematic photo-focused experience',
        icon: 'Image',
    },
    ios26: {
        name: 'iOS 26 Liquid Glass',
        description: 'Hard reference: iOS 26 translucent glass and rounded surfaces',
        icon: 'Smartphone',
    },
    android16: {
        name: 'Android 16 M3 Expressive',
        description: 'Hard reference: Material Design 3 Expressive tonal UI',
        icon: 'Sparkles',
    },
} as const;

export const cornerStyleConfig: Record<ThemeCornerStyle, { name: string; description: string }> = {
    soft: {
        name: 'Soft',
        description: 'Rounded surfaces and softer geometry',
    },
    sharp: {
        name: 'Sharp',
        description: 'Tighter radii and crisper corners',
    },
};

export const iconStyleConfig: Record<ThemeIconStyle, { name: string; description: string }> = {
    lucide: {
        name: 'Lucide',
        description: 'Default Lucide outline icon set',
    },
    'lucide-bold': {
        name: 'Lucide Bold',
        description: 'Lucide icons with heavier stroke weight',
    },
    iconify: {
        name: 'Iconify',
        description: 'Iconify icon set (Material-style)',
    },
};

export const appearanceModeConfig: Record<ThemeAppearanceMode, { name: string; description: string }> = {
    dark: {
        name: 'Dark',
        description: 'Low-light UI with darker surfaces and brighter accents',
    },
    light: {
        name: 'Light',
        description: 'Bright UI with lighter surfaces',
    },
};
