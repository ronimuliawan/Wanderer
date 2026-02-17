import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
    LayoutGrid,
    Settings,
    UploadCloud,
    Search,
    RefreshCcw,
    CheckCircle2,
    AlertCircle,
    Clock,
    Library,
    Cloud,
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    currentView: string;
    onViewChange: (view: string) => void;
}

import { QueueItem } from "../types";


export function Sidebar({ className, currentView, onViewChange }: SidebarProps) {
    const [user, setUser] = useState<string | null>(null);
    const [queue, setQueue] = useState<QueueItem[]>([]);

    useEffect(() => {
        api.getMe().then(setUser).catch(() => setUser(null));

        // Initial Fetch
        fetchQueue();

        // Poll every 2 seconds
        const interval = setInterval(fetchQueue, 2000);
        return () => clearInterval(interval);
    }, []);

    const fetchQueue = async () => {
        try {
            const items = await api.getQueueStatus();
            setQueue(items);
        } catch (e) {
            console.error("Failed to fetch queue", e);
        }
    };

    return (
        <div className={`w-64 border-r bg-background flex flex-col h-full overflow-hidden ${className}`}>
            {/* Header */}
            <div className="p-4 shrink-0">
                <h2 className="text-xl font-bold flex items-center gap-2 px-2">
                    <Cloud className="w-6 h-6" />
                    Wander(er)
                </h2>
            </div>

            {/* Scrollable Main Content */}
            <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-4">
                <nav className="space-y-1">
                    <Button variant={currentView === 'timeline' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => onViewChange('timeline')}>
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        Timeline
                    </Button>
                    <Button variant={currentView === 'albums' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => onViewChange('albums')}>
                        <Library className="mr-2 h-4 w-4" />
                        Albums
                    </Button>
                    <Button variant={currentView === 'search' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => onViewChange('search')}>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                    </Button>
                </nav>

                <div className="space-y-2">
                    <h3 className="px-2 text-sm font-semibold tracking-tight text-muted-foreground">
                        Import
                    </h3>
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={async () => {
                            try {
                                // Dynamic import to avoid SSR/Build issues if plugin not ready
                                const { open } = await import('@tauri-apps/plugin-dialog');
                                const selected = await open({
                                    multiple: true,
                                    directory: false,
                                });
                                if (selected) {
                                    const files = Array.isArray(selected) ? selected : [selected];
                                    const count = await api.importFiles(files);
                                    if (count > 0) alert(`Imported ${count} files!`);
                                }
                            } catch (e) {
                                alert("Import failed: " + JSON.stringify(e));
                            }
                        }}
                    >
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Import Files
                    </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-sm font-semibold tracking-tight">Queue</h3>
                        <span className="text-[10px] text-muted-foreground" title="Re-import files to retry uploads">
                            {queue.length} items
                        </span>
                    </div>

                    <div className="space-y-2">
                        {queue.length === 0 && (
                            <div className="text-sm text-muted-foreground px-2">No active uploads</div>
                        )}
                        {queue.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-xs border p-2 rounded-md bg-muted/50 gap-2">
                                <div className="flex-1 min-w-0 truncate" title={item.file_path}>
                                    {item.file_path.split(/[\\/]/).pop()}
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    {item.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                                    {item.status === 'pending' && <Clock className="w-3 h-3 text-yellow-500" />}
                                    {item.status === 'failed' && <AlertCircle className="w-3 h-3 text-red-500" />}
                                    {item.status === 'uploading' && <RefreshCcw className="w-3 h-3 animate-spin text-blue-500" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="p-3 border-t shrink-0 bg-background">
                <Button variant="ghost" className="w-full justify-start" onClick={() => onViewChange('settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    {user ? user : "Settings / Login"}
                </Button>
            </div>
        </div>
    );
}
