'use client';

import { trpc } from "@/trpc/client";

export const PageClient = () => {
    const [data] = trpc.hello.useSuspenseQuery({
        text: "Hi",
    });

    return (
        <div>
            Bro! { data.greeting }
        </div>
    )

}