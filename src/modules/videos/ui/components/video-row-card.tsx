import Link from "next/link";
import { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { UserAvatar } from "@/components/user-avatar";
import { UserInfo } from "@/modules/users/ui/components/user-info";

import { VideoMenu } from "./video-menu";
import { VideoThumbnail } from "./video-thumbnail";
import { VideoGetManyOutput } from "../../types"; 
import { formatDistanceToNow } from "date-fns";

const videoRowCardVariants = cva("group flex min-w-0", {
    variants: {
        size: {
            default: "gap-4",
            compact: "gap-2",
        },
    },
    defaultVariants: {
        size: "default",
    },
});

const thumbnailVariants = cva("relative flex-none", {
    variants: {
        size: {
            default: "w-[38%]",
            compact: "w-[168px]",
        },
    },
    defaultVariants: {
        size: "default",
    },
});

interface VideoRowCardProps extends VariantProps<typeof videoRowCardVariants> {
    data: VideoGetManyOutput["items"][number];
    onRemove?: () => void;
};

export const VideoRowCardSkeleton = () => {
    return (
        <div className="">
            <Skeleton />
        </div>
    )
}

export const VideoRowCard = ({
    data,
    size,
    onRemove,
}: VideoRowCardProps) => {
    const compactDate =  formatDistanceToNow(new Date(data.createdAt), { addSuffix: true });

    const compactViews = useMemo(() => {
        return Intl.NumberFormat("en", {
            notation: "compact"
        }).format(data.viewCount);
    }, [data.viewCount]);

    return (
        <div className={videoRowCardVariants({ size })}>
            <Link href={`/videos/${data.id}`} className={thumbnailVariants({ size })}>
                <VideoThumbnail 
                    imageUrl={data.thumbnailUrl}
                    previewUrl={data.previewUrl}
                    title={data.title}
                    duration={data.duration}
                />
            </Link>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-x-2">
                    <Link href={`videos/${data.id}`} className="flex-1 min-w-0">
                        <h3
                            className={cn(
                                "font-medium line-clamp-2",
                                size === "compact" ? "text-sm" :  "text-base",
                            )}
                        >
                            {data.title}
                        </h3>
                        {size === "default" && (
                            <>
                                <div className="flex items-center gap-2 mt-1">
                                    <UserInfo size="sm" name={data.user.name} />
                                </div>
                                {/* <Tooltip>
                                    <TooltipTrigger asChild>
                                        <p className="text-xs text-muted-foreground w-fit line-clamp-2">
                                            {data.description ?? "No description"}
                                        </p>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="bottom"
                                        align="center"
                                        className="bg-black/70"
                                    >
                                        <p>From the video description</p>
                                    </TooltipContent>
                                </Tooltip> */}
                            </>
                        )}
                        {size === "default" && (
                            <p className="text-sm text-muted-foreground ">
                                {compactViews} views • {compactDate}
                            </p>
                        )}
                        
                        {size === "compact" && (
                            <div>
                                <UserInfo size="sm" name={data.user.name} className="flex items-center gap-2 mt-1"/>
                                <p className="text-sm text-muted-foreground">
                                    {compactViews} views • {compactDate}
                                </p>
                            </div>
                        )}
                        {/* {size === "compact" && (
                            <p className="text-sm text-muted-foreground ">
                                {data.viewCount} views • {compactDate}
                            </p>
                        )} */}
                    </Link>
                    <div className="flex-none">
                        <VideoMenu 
                        videoId={data.id} 
                        onRemove={onRemove} 
                        variant="ghost" 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}