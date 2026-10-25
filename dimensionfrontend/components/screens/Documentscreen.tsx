"use client";
import React from "react";
import Tiptap from "../Tiptap";
import Mainpanel from "../Mainpanel";
import { useSidebar } from "../ui/sidebar";
import { useGetResourceByBatch, useGetResourceById } from "@/hooks/apihooks";
import { useQueryState } from "nuqs";
import ResourceTable from "./ResourceTable";
const Documentscreen = () => {
  const { state } = useSidebar();
  const [resourceId] = useQueryState("resourceId");
  console.log("the resource id ", resourceId);
  const { data, isLoading, isError } = useGetResourceById(resourceId as string);
  return (
    <>
      <Mainpanel state={state} className="w-full">
        <Tiptap
          resource_name={data?.data.resource_name}
          resource_content={data?.data.resource_content}
        />
      </Mainpanel>
    </>
  );
};

export default Documentscreen;
