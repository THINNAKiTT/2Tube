"use client";

import Link from "next/link";
import { useClerk, useAuth, } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { 
HistoryIcon,
ListVideoIcon,
ThumbsUpIcon} from 'lucide-react';

import { 
SidebarGroup, 
SidebarGroupLabel, 
SidebarGroupContent,
SidebarMenu, 
SidebarMenuButton, 
SidebarMenuItem } from '@/components/ui/sidebar';

const items = [
    {
        title: "History",
        url: "/feed/history",
        icon: HistoryIcon,
        auth: true,
    },
    {
        title: "Liked Videos",
        url: "/playlists/liked",
        icon: ThumbsUpIcon,
        auth: true,
    },
    {
        title: "All Playlists",
        url: "/feed/playlists",
        icon: ListVideoIcon,
        auth: true,
    },
];

export const PersonalSection = () => {
    const clerk = useClerk();
    const { isSignedIn }  = useAuth();
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>You</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                asChild
                                isActive={pathname === item.url}
                                onClick={(e) => {
                                    if (!isSignedIn && item.auth) {
                                        e.preventDefault();
                                        return clerk.openSignIn();
                                    }
                                }}
                            >
                                <Link prefetch href={item.url} className="flex items-centergap-4f">
                                    <item.icon/>
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>

    );
};