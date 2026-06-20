"use client";
import React from "react";
import Mainpanel from "../Mainpanel";
import { useSidebar } from "../ui/sidebar";
import Update from "../Update";

const Activityviewscreen = () => {
  const { state } = useSidebar();

  return (
    <Mainpanel state={state} className="overflow-y-auto pb-36">
      <div className="flex flex-col justify-start gap-2.5 w-full py-1">
        <Update variant="update" />
        <Update variant="display" />
        <Update variant="display" />
        <Update variant="display" />
        <Update variant="display" />
        <Update variant="display" />
        <Update variant="display" />
        <Update variant="display" />
      </div>
    </Mainpanel>
  );
};

export default Activityviewscreen;
