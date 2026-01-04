"use client";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "react-error-boundary";
import { VideoRowCard, VideoRowCardSkeleton } from "../components/video-row-card";
import { VideoGridCard, VideoGridCardSkeleton } from "../components/video-grid-card";

interface SuggestionsSectionProps {
    videoId: string;
    isManual?: boolean;
};

export const SuggestionsSection = ({
    videoId,
    isManual
}: SuggestionsSectionProps) => {
    return (
        <Suspense fallback={<SuggestionsSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <SuggestionsSectionSuspense videoId={videoId} isManual={isManual}/>
            </ErrorBoundary>
        </Suspense>
    )
}

export const VideoInfoSkeletion = () => {
    return (
        <div className="flex gap-3">
            <Skeleton className="size-10 flex-shrink-0 rounded-full" />
            <div className="flex flex-col flex-1 gap-2 mt-3">
                <Skeleton className="h-4 w-[60%]"/>
                <Skeleton className="h-3 w-[40%]"/>
                <Skeleton className="h-3 w-[60%]"/>
            </div>
        </div>
    )
}

const SuggestionsSectionSkeleton = () => {
    return (
        <>
            <div className="hidden md:block space-y-3">
                {Array.from({ length: 8 }).map((_, index) => (
                    <VideoRowCardSkeleton key={index} size="compact"/>
                ))}
            </div>
            <div className="block md:hidden space-y-10">
                {Array.from({ length: 8 }).map((_, index) => (
                    <VideoGridCardSkeleton key={index} />
                ))}
            </div>
        </>
    )
}

const SuggestionsSectionSuspense = ({
    videoId,
    isManual,
}: SuggestionsSectionProps) => {
    const [suggenstions, query] = trpc.suggestions.getMany.useSuspenseInfiniteQuery({
        videoId,
        limit: DEFAULT_LIMIT,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    return (
        <>
            <div className="hidden md:block space-y-3">
                {suggenstions.pages.flatMap((page) => page.items.map((video) => (
                    <VideoRowCard 
                        key={video.id}
                        data={video}
                        size="compact"
                    />
                )))}
            </div>
            <div className="block md:hidden space-y-10">
                {suggenstions.pages.flatMap((page) => page.items.map((video) => (
                    <VideoGridCard 
                        key={video.id}
                        data={video}
                    />
                )))}
            </div>
            <InfiniteScroll
                isManual={isManual}
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
            />
        </>
    );
};