import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { MediaItem } from "@/types";
import { MediaGrid } from "./MediaGrid";
import { MediaViewer } from "./MediaViewer";
import { Archive as ArchiveIcon } from "lucide-react";

export function Archive() {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isNextPageLoading, setIsNextPageLoading] = useState(false);

    const loadItems = useCallback(async () => {
        try {
            const newItems = await api.getArchivedMedia(100, 0);
            setItems(newItems);
            setHasNextPage(newItems.length >= 100);
        } catch (e) {
            console.error("Failed to load archived items:", e);
        }
    }, []);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    const loadNextPage = async (start: number, stop: number) => {
        if (isNextPageLoading || !hasNextPage) return;

        setIsNextPageLoading(true);
        try {
            const newItems = await api.getArchivedMedia(stop - start, start);
            if (newItems.length === 0) {
                setHasNextPage(false);
            } else {
                setItems(prev => [...prev, ...newItems]);
                setHasNextPage(newItems.length >= (stop - start));
            }
        } catch (e) {
            console.error("Failed to load more archived items:", e);
        } finally {
            setIsNextPageLoading(false);
        }
    };

    const handleItemClick = (item: MediaItem) => {
        setSelectedItem(item);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/10">
                    <ArchiveIcon className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                    <h1 className="text-lg font-semibold">Archive</h1>
                    <p className="text-sm text-muted-foreground">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                    </p>
                </div>
            </div>

            {/* Grid */}
            {items.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <ArchiveIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                        <h2 className="text-lg font-medium text-muted-foreground">No archived items</h2>
                        <p className="text-sm text-muted-foreground/60">
                            Archived items are hidden from your main timeline but appear here.
                        </p>
                    </div>
                </div>
            ) : (
                <MediaGrid
                    items={items}
                    hasNextPage={hasNextPage}
                    isNextPageLoading={isNextPageLoading}
                    loadNextPage={loadNextPage}
                    onItemClick={handleItemClick}
                    onItemsChange={loadItems}
                />
            )}

            {/* Media Viewer Modal */}
            {selectedItem && (
                <MediaViewer
                    item={selectedItem}
                    open={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
}
