"use client";
import { cn } from "@/lib/utils";
import React from "react";
type Mainpanelprops = {
  state?: "expanded" | "collapsed";
  className?: string;
  children?: React.ReactNode;
};
const Mainpanel = ({
  state = "expanded",
  className,
  children,
}: Mainpanelprops) => {
  return (
    <div
      className={cn(
        "h-full w-3/5 flex flex-col items-start",
        state === "expanded" ? "px-15" : "px-30",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Mainpanel;
