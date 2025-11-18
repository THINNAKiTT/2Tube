"use client";

import { UserButton, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';

// UI
import { Button } from '@/components/ui/button';
import { UserCircleIcon } from 'lucide-react';

export const AuthButton = () => {
    return (
        <>
        <SignedIn>
            <UserButton/>
        </SignedIn>
        <SignedOut>
            <SignInButton mode='modal'>
                <Button
                variant="outline"
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-400 border-blue-500/2
                rounded-full shadow-none [&_svg]:size-4"
                >
                    <UserCircleIcon/>
                    Sign In
                </Button>
            </SignInButton>
        </SignedOut>
        </>
    );
};