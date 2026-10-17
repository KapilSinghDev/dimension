"use client";
import React from "react";
import Mainpanel from "../Mainpanel";
import { useSidebar } from "../ui/sidebar";
import Update from "../Update";

const Activityviewscreen = () => {
  const { state } = useSidebar();

  return (
    <div className="flex  h-screen overflow-hidden">
      <Mainpanel state={state} className="min-h-0 w-full overflow-y-auto pb-36">
        <div className="flex w-full flex-col justify-start gap-2.5 py-1">
          <Update variant="update" />
          <Update variant="display" />
          {/* <Update variant="update" /> */}
          <Update variant="display" />
          <Update variant="display" />
          <Update variant="display" />
          <Update variant="display" />
          <Update variant="display" />
          <Update variant="display" />
          <Update variant="display" />
        </div>
      </Mainpanel>
    </div>
  );
};

export default Activityviewscreen;
