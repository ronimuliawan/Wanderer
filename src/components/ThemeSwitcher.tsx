import { useTheme, themeConfig, type ThemeVariant } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Folder, Image, Check, Palette, Smartphone, Sparkles, type LucideIcon } from 'lucide-react';

const themeOrder: ThemeVariant[] = ['explorer', 'immersive', 'ios26', 'android16'];
const themeIcons: Record<ThemeVariant, LucideIcon> = {
    explorer: Folder,
    immersive: Image,
    ios26: Smartphone,
    android16: Sparkles,
};

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 w-full justify-start"
                >
                    <Palette className="h-4 w-4" />
                    <span className="truncate">Theme: {themeConfig[theme].name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                {themeOrder.map((variant) => {
                    const Icon = themeIcons[variant];
                    return (
                        <DropdownMenuItem
                            key={variant}
                            onClick={() => setTheme(variant)}
                            className="gap-3 cursor-pointer"
                        >
                            <Icon className="h-4 w-4" />
                            <div className="flex flex-col flex-1">
                                <span className="font-medium">{themeConfig[variant].name}</span>
                                <span className="text-xs text-muted-foreground">
                                    {themeConfig[variant].description}
                                </span>
                            </div>
                            {theme === variant && <Check className="h-4 w-4 text-primary" />}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
