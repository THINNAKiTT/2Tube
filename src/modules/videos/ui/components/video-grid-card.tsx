import Link from "next/link";
import { VideoGetManyOutput } from "../../types";

import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { UserAvatar } from "@/components/user-avatar";

import { VideoMenu } from "./video-menu";
import { VideoInfoSkeletion } from "../sections/suggestions-section";
import { VideoThubnailSkeleton, VideoThumbnail } from "./video-thumbnail";
import { UserInfo } from "@/modules/users/ui/components/user-info";

interface VideoGridCardProps {
    data: VideoGetManyOutput["items"][number];
    onRemove?: () => void;
};

export const VideoGridCardSkeleton = () => {
    return (
        <div className="flex flex-col gap-2 w-full">
            <VideoThubnailSkeleton />
            <VideoInfoSkeletion />
        </div>
    )
}

export const VideoGridCard = ({
    data,
    onRemove
}: VideoGridCardProps) => {
    const compactDate =  formatDistanceToNow(new Date(data.createdAt), { addSuffix: true });

    const compactViews = useMemo(() => {
        return Intl.NumberFormat("en", {
            notation: "compact"
        }).format(data.viewCount);
    }, [data.viewCount]);

    return (
        <div className="flex flex-col gap-2 w-full group">
            <Link prefetch href={`/videos/${data.id}`}>
                <VideoThumbnail 
                    imageUrl={data.thumbnailUrl}
                    previewUrl={data.previewUrl}
                    title={data.title}
                    duration={data.duration}
                />
            </Link>
            <div className="flex gap-3">
                <Link prefetch href={`/users/${data.user.id}`}>
                        <UserAvatar 
                            imageUrl={data.user.imageUrl}
                            name={data.user.name}
                        />
                </Link>
                <div className="min-w-0 flex-1">
                    <Link prefetch href={`/videos/${data.id}`}>
                        <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">
                            {data.title}
                        </h3>
                    </Link>
                    <Link prefetch href={`/videos/${data.id}`}>
                        <p className="text-sm text-muted-foreground ">
                            {data.user.name} • {compactViews} views • {compactDate}
                        </p>
                    </Link>
                </div>
                <div className="flex-shrink-0">
                    <VideoMenu 
                        videoId={data.id}   
                        onRemove={onRemove}
                        variant="ghost"    
                    />
                </div>
            </div>
        </div>
    );
};

export const HomeVideoGridCard = ({
    data,
    onRemove
}: VideoGridCardProps) => {
    const compactDate =  formatDistanceToNow(new Date(data.createdAt), { addSuffix: true });

    const compactViews = useMemo(() => {
        return Intl.NumberFormat("en", {
            notation: "compact"
        }).format(data.viewCount);
    }, [data.viewCount]);

    return (
        <div className="flex flex-col gap-2 w-full group">
            <Link prefetch href={`/videos/${data.id}`}>
                <VideoThumbnail 
                    imageUrl={data.thumbnailUrl}
                    previewUrl={data.previewUrl}
                    title={data.title}
                    duration={data.duration}
                />
            </Link>
            <div className="flex gap-3">
                <Link prefetch href={`/users/${data.user.id}`}>
                        <UserAvatar 
                            imageUrl={data.user.imageUrl}
                            name={data.user.name}
                        />
                </Link>
                <div className="min-w-0 flex-1">
                    <Link prefetch href={`/videos/${data.id}`}>
                        <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">
                            {data.title}
                        </h3>
                    </Link>
                    <Link prefetch href={`/videos/${data.id}`}>
                        <UserInfo size="md" name={data.user.name} className="flex items-center gap-2 my-1"/>
                        <p className="text-sm text-muted-foreground ">
                            {compactViews} views • {compactDate}
                        </p>
                    </Link>
                </div>
                <div className="flex-shrink-0">
                    <VideoMenu 
                        videoId={data.id}   
                        onRemove={onRemove}
                        variant="ghost"    
                    />
                </div>
            </div>
        </div>
    );
};