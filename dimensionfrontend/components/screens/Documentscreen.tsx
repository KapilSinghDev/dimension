"use client";
import React from "react";
import Tiptap from "../Tiptap";
import Mainpanel from "../Mainpanel";
import { useSidebar } from "../ui/sidebar";
const Documentscreen = () => {
  const { state } = useSidebar();
  return (
    <>
      <Mainpanel state={state} className="w-full">
        <Tiptap />
      </Mainpanel>
    </>
  );
};

export default Documentscreen;
