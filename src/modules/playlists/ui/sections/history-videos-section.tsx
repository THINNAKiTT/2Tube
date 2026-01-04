"use client";

import { trpc } from "@/trpc/client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { DEFAULT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";

import { HomeVideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCardPlaylists, VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";

export const HistoryVideosSection = () => {
    return (
        <Suspense fallback={<HistoryVideosSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <HistoryVideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
};

const HistoryVideosSectionSkeleton = () => {
    return (
        <div>
            <div className="flex flex-col gap-4 gap-y-5 md:hidden">       
                {Array.from({ length: 18 }) .map((_, index) => (
                        <VideoGridCardSkeleton key={index} />
                    ))
                }
            </div>
            <div className="hidden flex-col gap-4 md:flex">       
                {Array.from({ length: 18 }) .map((_, index) => (
                        <VideoRowCardSkeleton key={index} size="playlist" />
                    ))
                }
            </div>
        </div>
    )
}

const HistoryVideosSectionSuspense = () => {
    const [videos, query] = trpc.playlists.getHistory.useSuspenseInfiniteQuery(
        { limit: DEFAULT_LIMIT },
        { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

    return (
        <div>
            <div className="flex flex-col gap-4 gap-y-5 md:hidden">       
                {videos.pages
                    .flatMap((page) => page.items)
                    .map((video) => (
                        <HomeVideoGridCard key={video.id} data={video} />
                    ))
                }
            </div>
            <div className="hidden flex-col gap-4 md:flex">       
                {videos.pages
                    .flatMap((page) => page.items)
                    .map((video) => (
                        <VideoRowCardPlaylists key={video.id} data={video} size="default" />
                    ))
                }
            </div>
            <InfiniteScroll 
                hasNextPage={query.hasNextPage} 
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}  
            />
        </div>
    )
}