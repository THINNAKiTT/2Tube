import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ListPlusIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/trpc/client";
import { PlaylistRenameModal } from "@/modules/playlists/ui/components/playlist-rename-modal";

interface PlaylistMenuProps {
    playlistId: string;
    variant?: "ghost" | "secondary";
};

export const PlaylistMenu = ({
    playlistId,
    variant,
}: PlaylistMenuProps) => {
    const [isOpenPlaylistRenameModal, setIsOpenPlaylistRenameModal] = useState(false);

    const router = useRouter();
    const utils = trpc.useUtils();
    const remove = trpc.playlists.remove.useMutation({
        onSuccess: () => {
            toast.success("Playlist removed");
            utils.playlists.getMany.invalidate();
            router.push("/feed/playlists")
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    });

    return (
        <>
            <PlaylistRenameModal
                playlistId={playlistId}
                open={isOpenPlaylistRenameModal}
                onOpenChange={setIsOpenPlaylistRenameModal}
            />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant={variant} size="icon" className="rounded-full">
                        <MoreVerticalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={() => setIsOpenPlaylistRenameModal(true)}>
                        <ListPlusIcon className="mr-2 size-4" />
                        Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => remove.mutate({ id: playlistId })}>
                        <Trash2Icon className="mr-2 size-4" />
                        Remove
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};