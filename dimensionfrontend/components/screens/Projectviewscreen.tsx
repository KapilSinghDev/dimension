"use client";

import {
  CalendarClock,
  CircleCheck,
  Crown,
  Flame,
  Plus,
  Paperclip,
  ArrowRight,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { Boxes } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { useSidebar } from "@/components/ui/sidebar";
import ProjectTabs from "@/components/ProjectTabs";
import Update from "@/components/Update";
import Addtarget from "@/components/Addtarget";
import Issuedisplay from "@/components/Issuedisplay";
import { useQueryState } from "nuqs";
const Projectviewscreen = () => {
  const { state } = useSidebar();
  const [tab, setTab] = useQueryState("tab");
  return (
    <>
      <div
        className={`h-full w-3/5 flex flex-col items-start ${state === "expanded" ? "px-15" : "px-30"} overflow-y-auto`}
      >
        <div className="h-fit w-fit  pt-5">
          <Boxes size={40} />
        </div>
        <h1 className="text-xl font-semibold text-gray-800">
          Dimension web app
          <Separator className="mt-2 bg-border/80" />
        </h1>
        <Textarea
          className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none mt-2 font-medium"
          placeholder="Add a short summary"
          maxLength={50}
        />
        <div className="h-fit flex flex-wrap gap-2">
          {[
            { icon: Flame, name: "High Priority", variant: "high" as const },
            { icon: Crown, name: "Team Lead", variant: "lead" as const },
            {
              icon: CalendarClock,
              name: "Target Completion",
              variant: "completed" as const,
            },
            { icon: CircleCheck, name: "Status", variant: "normal" as const },
          ].map((items, index) => (
            <ProjectTabs
              key={index}
              icon={items.icon}
              name={items.name}
              style={items.variant}
            />
          ))}
        </div>
        <div className="h-fit flex items-center justify-between gap-2 mt-4 mb-0.5">
          <Paperclip size={15} />
          <p className="text-sm font-medium text-foreground">
            Resources and Files
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground border-none"
            onClick={() => setTab("document")}
          >
            <Plus size={13} />
            Add
          </Button>
        </div>
        <Update variant="update" />
        {/* <Projectupdatemodal /> */}
        <Field className="mt-3">
          <FieldDescription>Description</FieldDescription>
          <Textarea
            placeholder="Add description"
            className="resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            maxLength={200}
          />
        </Field>
        <div className="w-full h-fit  min-w-0 overflow-x-auto px-1">
          {/* TODO : add the components to display the targets up here */}
          <div className="flex items-center justify-between">
            <Addtarget />
            <Button
              variant="ghost"
              size="sm"
              className="text-xs  hover:text-foreground gap-1.5 cursor-pointer"
            >
              View all
              <ArrowRight size={13} />
            </Button>
          </div>
          <div className="flex  items-start gap-1.5 w-full overflow-x-auto py-1 ">
            {[
              {
                milestone: "Design Review",
                desc: "Finalise all UI mockups",
                date: "Jun 15",
              },
              {
                milestone: "API Integration",
                desc: "Connect backend endpoints",
                date: "Jun 22",
              },
              {
                milestone: "Beta Launch",
                desc: "Ship to early access users",
                date: "Jul 01",
              },
            ].map((t, i) => (
              <Issuedisplay
                key={i}
                date={t.date}
                milestone={t.milestone}
                desc={t.desc}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Projectviewscreen;
