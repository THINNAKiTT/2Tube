import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import { SignedIn } from "@clerk/nextjs";
import { MainSection } from "./main-section"; 
import { PersonalSection } from "./personal-section";
import { SubscriptionsSection } from "./subscriptions-section";

export const HomeSidebar = () => {
    return (
        <Sidebar className="pt-16 z-40 border-none" collapsible="icon" >
            <SidebarContent className="bg-blackground">
                <MainSection />
                <Separator/>
                <PersonalSection />
                <SignedIn>
                    <>
                        <Separator />
                        <SubscriptionsSection />
                    </>
                </SignedIn>
            </SidebarContent>
        
        </Sidebar>
    );
};