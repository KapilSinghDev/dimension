"use client";
import React from "react";
import Mainpanel from "../Mainpanel";
import { useSidebar } from "../ui/sidebar";
import Update from "../Update";
import { parseAsString, useQueryStates } from "nuqs";
import { useGetProjectOverview } from "@/hooks/apihooks";
import { UpdatesResponseInterface } from "@/lib/response.types";
interface ActivityviewscreenProps {
  activity?: UpdatesResponseInterface[];
}
const Activityviewscreen = ({ activity }: ActivityviewscreenProps) => {
  const { state } = useSidebar();

  return (
    <div className="flex w-3/5  h-screen overflow-hidden">
      <Mainpanel state={state} className="min-h-0 w-full overflow-y-auto pb-36">
        <div className="flex w-full flex-col justify-start gap-2.5 py-1">
          <Update variant="update" />
          {activity?.map((updates, key) => (
            <Update
              key={key}
              variant="display"
              id={updates.update_id}
              comment={updates.update_comment}
              update_time={updates.update_time}
              update_asset={updates.update_asset}
            />
          ))}
        </div>
      </Mainpanel>
    </div>
  );
};

export default Activityviewscreen;
