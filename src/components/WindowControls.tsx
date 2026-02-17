import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Square, X, Maximize2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface WindowControlsProps {
    className?: string;
}

export function WindowControls({ className }: WindowControlsProps) {
    const [isMaximized, setIsMaximized] = useState(false);
    const appWindow = getCurrentWindow();

    useEffect(() => {
        const checkMaximized = async () => {
            setIsMaximized(await appWindow.isMaximized());
        };
        checkMaximized();

        const unlisten = appWindow.onResized(() => {
            checkMaximized();
        });

        return () => {
            unlisten.then(fn => fn());
        };
    }, [appWindow]);

    const handleMinimize = () => appWindow.minimize();
    const handleMaximize = () => appWindow.toggleMaximize();
    const handleClose = () => appWindow.close();

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {/* Close - Red */}
            <button
                type="button"
                onClick={handleClose}
                className="group relative flex h-4 w-4 min-w-[16px] items-center justify-center rounded-full bg-[#ff5f57] hover:bg-[#ff5f57] active:bg-[#bf4741] transition-colors p-0 shadow-sm"
                title="Close"
            >
                <X className="h-[10px] w-[10px] text-[#4d0000] opacity-0 group-hover:opacity-100 transition-opacity duration-100" strokeWidth={3} />
            </button>

            {/* Minimize - Yellow */}
            <button
                type="button"
                onClick={handleMinimize}
                className="group relative flex h-4 w-4 min-w-[16px] items-center justify-center rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e] active:bg-[#bf8e22] transition-colors p-0 shadow-sm"
                title="Minimize"
            >
                <Minus className="h-[10px] w-[10px] text-[#995700] opacity-0 group-hover:opacity-100 transition-opacity duration-100" strokeWidth={3} />
            </button>

            {/* Maximize/Restore - Green */}
            <button
                type="button"
                onClick={handleMaximize}
                className="group relative flex h-4 w-4 min-w-[16px] items-center justify-center rounded-full bg-[#28c940] hover:bg-[#28c940] active:bg-[#1e9630] transition-colors p-0 shadow-sm"
                title={isMaximized ? "Restore" : "Maximize"}
            >
                {isMaximized ? (
                    <Maximize2 className="h-[10px] w-[10px] text-[#006500] opacity-0 group-hover:opacity-100 transition-opacity duration-100" strokeWidth={3} />
                ) : (
                    <Square className="h-[8px] w-[8px] text-[#006500] opacity-0 group-hover:opacity-100 transition-opacity duration-100" strokeWidth={3} />
                )}
            </button>
        </div>
    );
}

// Separate TitleBar component for drag functionality
interface TitleBarProps {
    children: React.ReactNode;
    className?: string;
}

export function TitleBar({ children, className }: TitleBarProps) {
    const appWindow = getCurrentWindow();

    const handleMouseDown = (e: React.MouseEvent) => {
        // Don't drag if clicking on interactive elements
        if ((e.target as HTMLElement).closest('button, a, input, [role="button"], .no-drag')) {
            return;
        }

        if (e.buttons === 1) { // Left click only
            if (e.detail === 2) {
                // Double click to toggle maximize
                appWindow.toggleMaximize();
            } else {
                // Single click to start dragging
                appWindow.startDragging();
            }
        }
    };

    return (
        <div
            className={className}
            onMouseDown={handleMouseDown}
        // Removed data-tauri-drag-region to allow hover events on children
        >
            {children}
        </div>
    );
}
