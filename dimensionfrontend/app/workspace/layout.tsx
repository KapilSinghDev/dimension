"use client";
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Suspense } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Workspacelayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      {/* <SidebarProvider> */}
      <div className="flex h-screen w-full bg-gray-100">
        <AppSidebar />
        <main className="flex-1 min-w-0 ">
          <DndProvider backend={HTML5Backend}>
            <Suspense>{children}</Suspense>
          </DndProvider>
        </main>
      </div>
      {/* </SidebarProvider> */}
    </>
  );
};
export default Workspacelayout;
