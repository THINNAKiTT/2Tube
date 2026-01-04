"use client";

import { trpc } from "@/trpc/client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Skeleton } from "@/components/ui/skeleton";
import { PlaylistMenu } from "../components/playlist-menu";

interface PlaylistHeaderSectionProps {
    playlistId: string;
}

export const PlaylistHeaderSection = ({ 
    playlistId 
}: PlaylistHeaderSectionProps) => {
    return (
        <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <PlaylistHeaderSectionSuspense playlistId={playlistId} />
            </ErrorBoundary>
        </Suspense>
    );
};

const PlaylistHeaderSectionSkeleton = () => {
    return (
        <div className="flex flex-col gap-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-32" />
        </div>
    )
}

const PlaylistHeaderSectionSuspense = ({ 
    playlistId,
}: PlaylistHeaderSectionProps) => {
    const [playlist] = trpc.playlists.getOne.useSuspenseQuery({ id: playlistId });

    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">{playlist.name}</h1>
                <p className="text-xs text-muted-foreground">
                    Videos from the playlist
                </p>
            </div>
            <PlaylistMenu 
                playlistId={playlistId}
                variant="ghost"
            />
        </div>
    );
};