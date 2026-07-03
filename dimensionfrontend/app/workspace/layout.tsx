"use client";
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Suspense } from "react";
const Workspacelayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      {/* <SidebarProvider> */}
      <div className="flex h-screen w-full bg-gray-100">
        <AppSidebar />
        <main className="flex-1 min-w-0 ">
          <Suspense>{children}</Suspense>
        </main>
      </div>
      {/* </SidebarProvider> */}
    </>
  );
};
export default Workspacelayout;
