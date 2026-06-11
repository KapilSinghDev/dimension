import React from "react";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const Workspacelayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      {/* <SidebarProvider> */}
      <div className="flex h-screen w-full overflow-hidden bg-gray-100">
        <AppSidebar />
        <main className="flex-1 min-w-0 overflow-auto">{children}</main>
      </div>
      {/* </SidebarProvider> */}
    </>
  );
};
export default Workspacelayout;
