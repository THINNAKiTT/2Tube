import { SidebarProvider } from "@/components/ui/sidebar";

import { StudioNavbar } from "../components/studio-navbar";
import { StudioSidebar } from "../components/studio-sidebar";

interface StudioLayoutProps {
  children: React.ReactNode;
};

export const StudioLayout = ({ children }: StudioLayoutProps) => {
  return (
    <SidebarProvider>
        <div className="w-full h-full">
          <StudioNavbar />
            <div className="flex w-full h-full pt-[4rem]">
              <StudioSidebar/>
              <main className="flex w-full h-full overflow-y-auto">
                {children}
              </main>
            </div>
        </div>
    </SidebarProvider>
  );
};
