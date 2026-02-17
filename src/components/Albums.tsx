import { useEffect, useState } from "react";
import { Album } from "../types";
import { api } from "../lib/api";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FolderPlus, Image as ImageIcon } from "lucide-react";
import { convertFileSrc } from "@tauri-apps/api/core";
import { AlbumDetail } from "./AlbumDetail";

export function Albums() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newAlbumName, setNewAlbumName] = useState("");

    const loadAlbums = () => {
        api.getAlbums().then(setAlbums).catch(console.error);
    };

    useEffect(() => {
        loadAlbums();
    }, []);

    const handleCreateAlbum = async () => {
        if (!newAlbumName.trim()) return;
        try {
            await api.createAlbum(newAlbumName);
            setIsCreateOpen(false);
            setNewAlbumName("");
            loadAlbums();
        } catch (e) {
            console.error("Failed to create album", e);
        }
    };

    if (selectedAlbum) {
        return <AlbumDetail album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />;
    }

    return (
        <div className="h-full flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Albums</h2>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <FolderPlus className="mr-2 h-4 w-4" />
                            Create Album
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Album</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={newAlbumName}
                                    onChange={(e) => setNewAlbumName(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateAlbum}>Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto">
                {albums.map((album) => (
                    <Card
                        key={album.id}
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => setSelectedAlbum(album)}
                    >
                        <CardContent className="p-4 flex flex-col items-center justify-center aspect-square relative overflow-hidden">
                            {album.cover_path ? (
                                <img
                                    src={convertFileSrc(album.cover_path)}
                                    alt={album.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-muted-foreground w-full h-full bg-muted/20">
                                    <ImageIcon className="h-10 w-10 mb-2" />
                                    <span className="text-xs">Empty</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />
                        </CardContent>
                        <CardHeader className="p-4 pt-2">
                            <CardTitle className="text-base truncate">{album.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">
                                {new Date(album.created_at * 1000).toLocaleDateString()}
                            </p>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}
