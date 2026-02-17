import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar"
import {
    LayoutGrid,
    Library,
    Search,
    UploadCloud,
    ChevronRight,
    MoreVertical,
    LogOut,
    Sparkles,
    Clock,
    FolderOpen,
    Settings,
    Home,
    Image,
    HardDrive,
    Heart,
    Trash2,
    MapPin,
    Copy,
    Users,
    Tag,
    Archive as ArchiveIcon,
    LogIn,
    type LucideIcon,
} from "lucide-react"
import { Icon as IconifyIcon } from "@iconify/react"
import harddiskIcon from "@iconify-icons/mdi/harddisk"
import chevronRightIcon from "@iconify-icons/mdi/chevron-right"
import homeOutlineIcon from "@iconify-icons/mdi/home-outline"
import historyIcon from "@iconify-icons/mdi/history"
import heartOutlineIcon from "@iconify-icons/mdi/heart-outline"
import archiveOutlineIcon from "@iconify-icons/mdi/archive-outline"
import deleteOutlineIcon from "@iconify-icons/mdi/delete-outline"
import cloudUploadOutlineIcon from "@iconify-icons/mdi/cloud-upload-outline"
import mapMarkerOutlineIcon from "@iconify-icons/mdi/map-marker-outline"
import contentCopyIcon from "@iconify-icons/mdi/content-copy"
import accountGroupOutlineIcon from "@iconify-icons/mdi/account-group-outline"
import tagOutlineIcon from "@iconify-icons/mdi/tag-outline"
import autoFixHighIcon from "@iconify-icons/mdi/auto-fix-high"
import imageOutlineIcon from "@iconify-icons/mdi/image-outline"
import imageMultipleOutlineIcon from "@iconify-icons/mdi/image-multiple-outline"
import folderOpenOutlineIcon from "@iconify-icons/mdi/folder-open-outline"
import magnifyIcon from "@iconify-icons/mdi/magnify"
import cogOutlineIcon from "@iconify-icons/mdi/cog-outline"
import dotsHorizontalIcon from "@iconify-icons/mdi/dots-horizontal"
import logoutVariantIcon from "@iconify-icons/mdi/logout-variant"
import loginVariantIcon from "@iconify-icons/mdi/login-variant"
import viewGridOutlineIcon from "@iconify-icons/mdi/view-grid-outline"
import type { IconifyIcon as IconifyIconData } from "@iconify/types"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"

// -- Types --
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    currentView: string;
    onViewChange: (view: string) => void;
}

interface ThemedIconProps {
    lucide: LucideIcon;
    iconify: IconifyIconData;
    className?: string;
    iconStyle: "lucide" | "lucide-bold" | "iconify";
}

function ThemedIcon({ lucide: Lucide, iconify, className, iconStyle }: ThemedIconProps) {
    if (iconStyle === "iconify") {
        return <IconifyIcon icon={iconify} className={className} />;
    }
    return <Lucide className={className} strokeWidth={iconStyle === "lucide-bold" ? 2.45 : 2} />;
}

const ICONS = {
    harddisk: harddiskIcon,
    chevronRight: chevronRightIcon,
    home: homeOutlineIcon,
    history: historyIcon,
    heart: heartOutlineIcon,
    archive: archiveOutlineIcon,
    trash: deleteOutlineIcon,
    upload: cloudUploadOutlineIcon,
    map: mapMarkerOutlineIcon,
    copy: contentCopyIcon,
    users: accountGroupOutlineIcon,
    tag: tagOutlineIcon,
    sparkles: autoFixHighIcon,
    image: imageOutlineIcon,
    imageMultiple: imageMultipleOutlineIcon,
    folderOpen: folderOpenOutlineIcon,
    search: magnifyIcon,
    settings: cogOutlineIcon,
    more: dotsHorizontalIcon,
    logout: logoutVariantIcon,
    login: loginVariantIcon,
    grid: viewGridOutlineIcon,
} as const;

export function AppSidebar({ currentView, onViewChange, ...props }: AppSidebarProps) {
    const [user, setUser] = useState<string | null>(null);
    const { theme, iconStyle } = useTheme();
    const isImmersiveTheme = theme === 'immersive';
    const isIos26Theme = theme === 'ios26';
    const isAndroid16Theme = theme === 'android16';

    useEffect(() => {
        const checkUser = () => api.getMe().then(setUser).catch(() => setUser(null));
        checkUser();

        window.addEventListener('auth-changed', checkUser);
        return () => window.removeEventListener('auth-changed', checkUser);
    }, []);

    const handleLogout = async () => {
        try {
            const { ask } = await import('@tauri-apps/plugin-dialog');
            const confirmed = await ask("Are you sure you want to log out? This will delete your local session.", {
                title: "Log out",
                kind: 'warning'
            });

            if (!confirmed) return;

            await api.logout();
            setUser(null);
            onViewChange('settings');
            toast.success("Logged out successfully");
            window.dispatchEvent(new Event('auth-changed'));
        } catch (e) {
            console.error("Logout failed", e);
            toast.error("Failed to log out");
        }
    };

    const handleImport = async () => {
        try {
            const { open } = await import('@tauri-apps/plugin-dialog');
            const selected = await open({ multiple: true, directory: false });
            if (selected) {
                const files = Array.isArray(selected) ? selected : [selected];

                const toastId = toast.loading(`Importing ${files.length} files...`);

                const count = await api.importFiles(files);

                if (count > 0) {
                    toast.success(`Successfully imported ${count} ${count === 1 ? 'file' : 'files'}`, { id: toastId });
                } else {
                    toast.info("No new files imported (all duplicates)", { id: toastId });
                }
            }
        } catch (e) {
            console.error("Import failed", e);
            toast.error("Failed to import files");
        }
    };

    // ==========================================
    // EXPLORER THEME SIDEBAR (Spacedrive-style)
    // ==========================================
    if (theme === 'explorer') {
        return (
            <Sidebar collapsible="icon" {...props} className="border-r border-sidebar-border">
                {/* Library Dropdown Header */}
                <SidebarHeader className="px-3 py-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-sidebar-accent transition-colors text-sm font-semibold">
                                <ThemedIcon lucide={HardDrive} iconify={ICONS.harddisk} className="h-4 w-4 text-primary" iconStyle={iconStyle} />
                                <span>My Library</span>
                                <ThemedIcon lucide={ChevronRight} iconify={ICONS.chevronRight} className="h-3 w-3 ml-auto text-muted-foreground" iconStyle={iconStyle} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuItem>
                                <ThemedIcon lucide={HardDrive} iconify={ICONS.harddisk} className="h-4 w-4 mr-2" iconStyle={iconStyle} />
                                My Library
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarHeader>

                <SidebarContent className="px-2">
                    {/* Quick Access */}
                    <SidebarGroup>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={currentView === 'timeline'}
                                    onClick={() => onViewChange('timeline')}
                                    className="gap-3"
                                >
                                    <ThemedIcon lucide={Home} iconify={ICONS.home} className="h-4 w-4" iconStyle={iconStyle} />
                                    <span>Overview</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={() => onViewChange('timeline')}
                                    className="gap-3"
                                >
                                    <ThemedIcon lucide={Clock} iconify={ICONS.history} className="h-4 w-4" iconStyle={iconStyle} />
                                    <span>Recents</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={currentView === 'favorites'}
                                    onClick={() => onViewChange('favorites')}
                                    className="gap-3"
                                >
                                    <ThemedIcon lucide={Heart} iconify={ICONS.heart} className="h-4 w-4" iconStyle={iconStyle} />
                                    <span>Favorites</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={currentView === 'archive'}
                                    onClick={() => onViewChange('archive')}
                                    className="gap-3"
                                >
                                    <ThemedIcon lucide={ArchiveIcon} iconify={ICONS.archive} className="h-4 w-4" iconStyle={iconStyle} />
                                    <span>Archive</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={currentView === 'trash'}
                                    onClick={() => onViewChange('trash')}
                                    className="gap-3"
                                >
                                    <ThemedIcon lucide={Trash2} iconify={ICONS.trash} className="h-4 w-4" iconStyle={iconStyle} />
                                    <span>Trash</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={currentView === 'uploads'}
                                    onClick={() => onViewChange('uploads')}
                                    className="gap-3"
                                >
                                    <ThemedIcon lucide={UploadCloud} iconify={ICONS.upload} className="h-4 w-4" iconStyle={iconStyle} />
                                    <span>Uploads</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={currentView === 'map'}
                                    onClick={() => onViewChange('map')}
                                    className="gap-3"
                                >
                                    <ThemedIcon lucide={MapPin} iconify={ICONS.map} className="h-4 w-4" iconStyle={iconStyle} />
                                    <span>Map</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={currentView === 'duplicates'}
                                    onClick={() => onViewChange('duplicates')}
                                    className="gap-3"
                                >
                                    <ThemedIcon lucide={Copy} iconify={ICONS.copy} className="h-4 w-4" iconStyle={iconStyle} />
                                    <span>Duplicates</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={currentView === 'people'}
                                    onClick={() => onViewChange('people')}
                                    className="gap-3"
                                >
                                    <ThemedIcon lucide={Users} iconify={ICONS.users} className="h-4 w-4" iconStyle={iconStyle} />
                                    <span>People</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={currentView === 'tags'}
                                    onClick={() => onViewChange('tags')}
                                    className="gap-3"
                                >
                                    <ThemedIcon lucide={Tag} iconify={ICONS.tag} className="h-4 w-4" iconStyle={iconStyle} />
                                    <span>Tags</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={currentView === 'smart-albums'}
                                    onClick={() => onViewChange('smart-albums')}
                                    className="gap-3"
                                >
                                    <ThemedIcon lucide={Sparkles} iconify={ICONS.sparkles} className="h-4 w-4" iconStyle={iconStyle} />
                                    <span>Smart Albums</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>

                    {/* Locations */}
                    <SidebarGroup>
                        <SidebarGroupLabel className="sidebar-section-label text-xs uppercase tracking-wider text-muted-foreground px-2 mb-1">
                            Locations
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={currentView === 'timeline'}
                                    onClick={() => onViewChange('timeline')}
                                    className="gap-3"
                                >
                                    <ThemedIcon lucide={Image} iconify={ICONS.image} className="h-4 w-4" iconStyle={iconStyle} />
                                    <span>All Photos</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                                <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={currentView === 'albums'}
                                    onClick={() => onViewChange('albums')}
                                    className="gap-3"
                                >
                                    <ThemedIcon lucide={FolderOpen} iconify={ICONS.folderOpen} className="h-4 w-4" iconStyle={iconStyle} />
                                    <span>Albums</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                                <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={currentView === 'search'}
                                    onClick={() => onViewChange('search')}
                                    className="gap-3"
                                >
                                    <ThemedIcon lucide={Search} iconify={ICONS.search} className="h-4 w-4" iconStyle={iconStyle} />
                                    <span>Search</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* Tags */}
                    <SidebarGroup>
                        <SidebarGroupLabel className="sidebar-section-label text-xs uppercase tracking-wider text-muted-foreground px-2 mb-1">
                            Tags
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton className="gap-3">
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                                        <span>Important</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton className="gap-3">
                                        <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                                        <span>Family</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton className="gap-3">
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                                        <span>Travel</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                </SidebarContent>

                <SidebarFooter className="border-t border-sidebar-border p-2">
                    <SidebarMenu className="space-y-1">
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={handleImport} className="gap-3">
                                <ThemedIcon lucide={UploadCloud} iconify={ICONS.upload} className="h-4 w-4" iconStyle={iconStyle} />
                                <span>Import Files</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={currentView === 'settings'}
                                onClick={() => onViewChange('settings')}
                                className={cn(
                                    "gap-3 py-2 rounded-md transition-all duration-300",
                                    currentView === 'settings' && "bg-primary/10 text-primary shadow-sm"
                                )}
                            >
                                <ThemedIcon lucide={Settings} iconify={ICONS.settings} className="h-4 w-4" iconStyle={iconStyle} />
                                <span className="font-medium">Settings</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>

                    {/* User Profile - Immersive Style Adapted */}
                    <div className="mt-2 pt-2 border-t border-sidebar-border">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-3 w-full px-2 py-2 rounded-md hover:bg-sidebar-accent/50 transition-colors">
                                    <Avatar className="h-9 w-9 rounded-md ring-2 ring-primary/20">
                                        <AvatarImage src="" alt={user || "User"} />
                                        <AvatarFallback className="rounded-md bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                                            {user ? user.charAt(0).toUpperCase() : "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left leading-tight">
                                        <span className="text-sm font-semibold">{user || "Guest"}</span>
                                        <span className="text-xs text-muted-foreground">{user ? "Connected" : "Not logged in"}</span>
                                    </div>
                                    <ThemedIcon lucide={MoreVertical} iconify={ICONS.more} className="h-4 w-4 text-muted-foreground" iconStyle={iconStyle} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56 rounded-md">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">{user || "Guest"}</p>
                                        <p className="text-xs text-muted-foreground">{(user || "guest") + "@wander.app"}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onViewChange('settings')}>
                                    <ThemedIcon lucide={Sparkles} iconify={ICONS.sparkles} className="mr-2 h-4 w-4" iconStyle={iconStyle} />
                                    Settings
                                </DropdownMenuItem>
                                {user ? (
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <ThemedIcon lucide={LogOut} iconify={ICONS.logout} className="mr-2 h-4 w-4" iconStyle={iconStyle} />
                                        Log out
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem onClick={() => onViewChange('settings')}>
                                        <ThemedIcon lucide={LogIn} iconify={ICONS.login} className="mr-2 h-4 w-4" iconStyle={iconStyle} />
                                        Log in
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </SidebarFooter>
            </Sidebar>
        )
    }

    // ==========================================
    // IMMERSIVE-LIKE SIDEBAR (Immersive + iOS 26 + Android 16)
    // ==========================================
    return (
        <Sidebar
            collapsible="icon"
            {...props}
            className={cn(
                "border-r",
                isImmersiveTheme && "sidebar-glass border-r-0",
                isIos26Theme && "sidebar-glass ios26-sidebar-shell border-r-0",
                isAndroid16Theme && "android16-sidebar-shell"
            )}
        >
            <SidebarHeader className="px-4 py-4">
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            "flex aspect-square size-10 items-center justify-center text-white shadow-lg",
                            isIos26Theme
                                ? "rounded-[14px] bg-gradient-to-br from-cyan-300 via-sky-500 to-blue-600 shadow-sky-500/30 ring-1 ring-white/40"
                                : isAndroid16Theme
                                    ? "rounded-[20px] bg-gradient-to-br from-emerald-400 via-lime-500 to-teal-600 shadow-emerald-500/25"
                                    : "rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20"
                        )}
                    >
                        <ThemedIcon lucide={Image} iconify={ICONS.image} className="size-5" iconStyle={iconStyle} />
                    </div>
                    <div className="grid flex-1 text-left leading-tight">
                        <span className="font-display text-base font-semibold tracking-tight">Wander(er)</span>
                        <span className="text-xs text-muted-foreground">
                            {isIos26Theme
                                ? "iOS 26 Liquid Glass"
                                : isAndroid16Theme
                                    ? "Android 16 M3 Expressive"
                                    : "Your memories"}
                        </span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-3">
                {/* Main Navigation */}
                <SidebarGroup>
                    <SidebarMenu className="space-y-1">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={currentView === 'timeline'}
                                onClick={() => onViewChange('timeline')}
                                className={cn(
                                    "gap-3 py-2.5 rounded-xl transition-all duration-300",
                                    currentView === 'timeline' && "bg-primary/10 text-primary shadow-sm"
                                )}
                            >
                                <ThemedIcon lucide={LayoutGrid} iconify={ICONS.grid} className="h-4 w-4" iconStyle={iconStyle} />
                                <span className="font-medium">Timeline</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={currentView === 'albums'}
                                onClick={() => onViewChange('albums')}
                                className={cn(
                                    "gap-3 py-2.5 rounded-xl transition-all duration-300",
                                    currentView === 'albums' && "bg-primary/10 text-primary shadow-sm"
                                )}
                            >
                                <ThemedIcon lucide={Library} iconify={ICONS.imageMultiple} className="h-4 w-4" iconStyle={iconStyle} />
                                <span className="font-medium">Albums</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={currentView === 'search'}
                                onClick={() => onViewChange('search')}
                                className={cn(
                                    "gap-3 py-2.5 rounded-xl transition-all duration-300",
                                    currentView === 'search' && "bg-primary/10 text-primary shadow-sm"
                                )}
                            >
                                <ThemedIcon lucide={Search} iconify={ICONS.search} className="h-4 w-4" iconStyle={iconStyle} />
                                <span className="font-medium">Search</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={currentView === 'people'}
                                onClick={() => onViewChange('people')}
                                className={cn(
                                    "gap-3 py-2.5 rounded-xl transition-all duration-300",
                                    currentView === 'people' && "bg-primary/10 text-primary shadow-sm"
                                )}
                            >
                                <ThemedIcon lucide={Users} iconify={ICONS.users} className="h-4 w-4" iconStyle={iconStyle} />
                                <span className="font-medium">People</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={currentView === 'tags'}
                                onClick={() => onViewChange('tags')}
                                className={cn(
                                    "gap-3 py-2.5 rounded-xl transition-all duration-300",
                                    currentView === 'tags' && "bg-primary/10 text-primary shadow-sm"
                                )}
                            >
                                <ThemedIcon lucide={Tag} iconify={ICONS.tag} className="h-4 w-4" iconStyle={iconStyle} />
                                <span className="font-medium">Tags</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={currentView === 'map'}
                                onClick={() => onViewChange('map')}
                                className={cn(
                                    "gap-3 py-2.5 rounded-xl transition-all duration-300",
                                    currentView === 'map' && "bg-primary/10 text-primary shadow-sm"
                                )}
                            >
                                <ThemedIcon lucide={MapPin} iconify={ICONS.map} className="h-4 w-4" iconStyle={iconStyle} />
                                <span className="font-medium">Map</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={currentView === 'duplicates'}
                                onClick={() => onViewChange('duplicates')}
                                className={cn(
                                    "gap-3 py-2.5 rounded-xl transition-all duration-300",
                                    currentView === 'duplicates' && "bg-primary/10 text-primary shadow-sm"
                                )}
                            >
                                <ThemedIcon lucide={Copy} iconify={ICONS.copy} className="h-4 w-4" iconStyle={iconStyle} />
                                <span className="font-medium">Duplicates</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={currentView === 'smart-albums'}
                                onClick={() => onViewChange('smart-albums')}
                                className={cn(
                                    "gap-3 py-2.5 rounded-xl transition-all duration-300",
                                    currentView === 'smart-albums' && "bg-primary/10 text-primary shadow-sm"
                                )}
                            >
                                <ThemedIcon lucide={Sparkles} iconify={ICONS.sparkles} className="h-4 w-4" iconStyle={iconStyle} />
                                <span className="font-medium">Smart Albums</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={currentView === 'favorites'}
                                onClick={() => onViewChange('favorites')}
                                className={cn(
                                    "gap-3 py-2.5 rounded-xl transition-all duration-300",
                                    currentView === 'favorites' && "bg-primary/10 text-primary shadow-sm"
                                )}
                            >
                                <ThemedIcon lucide={Heart} iconify={ICONS.heart} className="h-4 w-4" iconStyle={iconStyle} />
                                <span className="font-medium">Favorites</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={currentView === 'archive'}
                                onClick={() => onViewChange('archive')}
                                className={cn(
                                    "gap-3 py-2.5 rounded-xl transition-all duration-300",
                                    currentView === 'archive' && "bg-primary/10 text-primary shadow-sm"
                                )}
                            >
                                <ThemedIcon lucide={ArchiveIcon} iconify={ICONS.archive} className="h-4 w-4" iconStyle={iconStyle} />
                                <span className="font-medium">Archive</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={currentView === 'trash'}
                                onClick={() => onViewChange('trash')}
                                className={cn(
                                    "gap-3 py-2.5 rounded-xl transition-all duration-300",
                                    currentView === 'trash' && "bg-primary/10 text-primary shadow-sm"
                                )}
                            >
                                <ThemedIcon lucide={Trash2} iconify={ICONS.trash} className="h-4 w-4" iconStyle={iconStyle} />
                                <span className="font-medium">Trash</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={currentView === 'uploads'}
                                onClick={() => onViewChange('uploads')}
                                className={cn(
                                    "gap-3 py-2.5 rounded-xl transition-all duration-300",
                                    currentView === 'uploads' && "bg-primary/10 text-primary shadow-sm"
                                )}
                            >
                                <ThemedIcon lucide={UploadCloud} iconify={ICONS.upload} className="h-4 w-4" iconStyle={iconStyle} />
                                <span className="font-medium">Uploads</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

            </SidebarContent>

            <SidebarFooter className="px-3 pb-4">
                <SidebarMenu className="space-y-1">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={handleImport}
                            className="gap-3 py-2.5 rounded-xl bg-primary/8 text-foreground hover:bg-primary/14 transition-all duration-300 group"
                        >
                            <ThemedIcon lucide={UploadCloud} iconify={ICONS.upload} className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" iconStyle={iconStyle} />
                            <span className="font-medium">Import Files</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            isActive={currentView === 'settings'}
                            onClick={() => onViewChange('settings')}
                            className={cn(
                                "gap-3 py-2.5 rounded-xl transition-all duration-300",
                                currentView === 'settings' && "bg-primary/10 text-primary shadow-sm"
                            )}
                        >
                            <ThemedIcon lucide={Settings} iconify={ICONS.settings} className="h-4 w-4" iconStyle={iconStyle} />
                            <span className="font-medium">Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* User Profile */}
                <div className="mt-4 pt-4 border-t border-sidebar-border">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 w-full px-2 py-2 rounded-xl hover:bg-sidebar-accent/50 transition-colors">
                                <Avatar className="h-9 w-9 rounded-xl ring-2 ring-primary/20">
                                    <AvatarImage src="" alt={user || "User"} />
                                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                                        {user ? user.charAt(0).toUpperCase() : "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left leading-tight">
                                    <span className="text-sm font-semibold">{user || "Guest"}</span>
                                    <span className="text-xs text-muted-foreground">{user ? "Connected" : "Not logged in"}</span>
                                </div>
                                <ThemedIcon lucide={MoreVertical} iconify={ICONS.more} className="h-4 w-4 text-muted-foreground" iconStyle={iconStyle} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">{user || "Guest"}</p>
                                    <p className="text-xs text-muted-foreground">{(user || "guest") + "@wander.app"}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onViewChange('settings')}>
                                <ThemedIcon lucide={Sparkles} iconify={ICONS.sparkles} className="mr-2 h-4 w-4" iconStyle={iconStyle} />
                                Settings
                            </DropdownMenuItem>
                            {user ? (
                                <DropdownMenuItem onClick={handleLogout}>
                                    <ThemedIcon lucide={LogOut} iconify={ICONS.logout} className="mr-2 h-4 w-4" iconStyle={iconStyle} />
                                    Log out
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={() => onViewChange('settings')}>
                                    <ThemedIcon lucide={LogIn} iconify={ICONS.login} className="mr-2 h-4 w-4" iconStyle={iconStyle} />
                                    Log in
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

