import { useEffect, useState } from 'react';
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { convertFileSrc } from '@tauri-apps/api/core';
import { Person } from "../types";
import { PersonDetail } from "./PersonDetail";

export function People() {
    const [persons, setPersons] = useState<Person[]>([]);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

    useEffect(() => {
        loadPersons();
    }, []);

    const loadPersons = async () => {
        try {
            console.log("Loading persons...");
            const result = await api.getPeople();
            console.log("Loaded persons:", result);
            setPersons(result);
        } catch (error) {
            console.error("Failed to load persons:", error);
        }
    };

    const getAssetUrl = (path?: string | null) => {
        if (!path) return '';
        return convertFileSrc(path);
    };

    if (selectedPerson) {
        return <PersonDetail
            person={selectedPerson}
            onBack={(shouldRefresh) => {
                setSelectedPerson(null);
                if (shouldRefresh) {
                    loadPersons();
                }
            }}
            onUpdate={(updated) => {
                setPersons(prev => prev.map(p => p.id === updated.id ? updated : p));
                setSelectedPerson(updated);
            }}
        />;
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 h-full overflow-y-auto">
            {persons.length === 0 ? (
                <div className="text-center text-muted-foreground mt-10">
                    No people found yet. Add photos with faces to start clustering.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {persons.map((person) => (
                        <Card
                            key={person.id}
                            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => setSelectedPerson(person)}
                        >
                            <div className="aspect-square relative">
                                {person.cover_path ? (
                                    <img
                                        src={getAssetUrl(person.cover_path)}
                                        alt={person.name || 'Person'}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                        <Avatar className="w-20 h-20">
                                            <AvatarFallback>
                                                {(person.name || '?').substring(0, 1)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                    <h3 className="text-white font-medium truncate drop-shadow-sm">
                                        {person.name || `Person ${person.id}`}
                                    </h3>
                                    <p className="text-white/80 text-xs drop-shadow-sm">{person.face_count} photos</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
