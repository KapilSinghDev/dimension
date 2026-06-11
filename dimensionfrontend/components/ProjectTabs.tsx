"use client";
import { LucideIcon } from "lucide-react";
import React from "react";
import { Badge } from "./ui/badge";
import { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";

type ProjectTabsprops = {
  name: string;
  icon: LucideIcon;
  style: VariantProps<typeof badgeVariants>["variant"];
};
const iconColorMapper = [
  {
    key: "high",
    label: "High",
    style:
      " text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  {
    key: "low",
    label: "Low",
    style:
      " text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  },
  {
    key: "lead",
    label: "Lead",
    style:
      " text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  {
    key: "coordinator",
    label: "Coordinator",
    style:
      " text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700",
  },
  {
    key: "normal",
    label: "Normal",
    style:
      " text-green-700 dark:bg-green-950 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  {
    key: "completed",
    label: "Completed",
    style:
      " text-white dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
];
const ProjectTabs = ({ name, icon: Icon, style }: ProjectTabsprops) => {
  return (
    <>
      <div className="flex items-center gap-1.5 hover:cursor-pointer">
        <Icon
          size={14}
          className={
            iconColorMapper.find((variations) => variations.key === style)
              ?.style
          }
        />
        <Badge variant={style}>{name}</Badge>
      </div>
    </>
  );
};

export default ProjectTabs;
