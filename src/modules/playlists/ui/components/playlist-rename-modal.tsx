import z from "zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { trpc } from "@/trpc/client";
import { ResponsiveModal } from "@/components/responsive-modal";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormLabel,
    FormItem,
    FormMessage,
    FormField,
} from "@/components/ui/form";

interface PlaylistRenameModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    playlistId: string;
}

const formSchema = z.object({
    name: z.string().min(1),
});

export const PlaylistRenameModal = ({
    open,
    onOpenChange,
    playlistId,
}: PlaylistRenameModalProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "" },
    });

    const { data: playlist, isLoading } = trpc.playlists.getOne.useQuery(
        { id: playlistId },
        { enabled: !!playlistId && open }
    );

    useEffect(() => {
        if (playlist) {
            form.reset({ name: playlist.name });
        }
    }, [playlist, form]);

    const utils = trpc.useUtils();
    const update = trpc.playlists.update.useMutation({
        onSuccess: (data) => {
            toast.success("Playlist renamed");
            utils.playlists.getMany.invalidate();
            utils.playlists.getOne.invalidate({ id: data.id });
            onOpenChange(false);
        },
        onError: () => {
            toast.error("Something went wrong");
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        update.mutate({ id: playlistId, name: values.name });
    };

    return (
        <ResponsiveModal
            title="Rename playlist"
            open={open}
            onOpenChange={onOpenChange}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Playlist name" disabled={isLoading} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button disabled={update.isPending} type="submit">
                            Rename
                        </Button>
                    </div>
                </form>
            </Form>
        </ResponsiveModal>
    );
};
