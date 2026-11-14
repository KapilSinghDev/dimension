"use client";
import { UserRound } from "lucide-react";
import React, { ElementType } from "react";
import { IssueDetail } from "./screens/Issuescreen";
interface IssuePropertyItem {
  label: string;
  value: string | number; // Or React.ReactNode if values can be custom elements/badges
  icon: ElementType; // Use `LucideIcon` here if you prefer strict Lucide typing
}
interface Propertytabsinterface {
  detailItems: IssuePropertyItem[];
  issueDetails: IssueDetail;
}

export const Propertytabs = ({
  detailItems,
  issueDetails,
}: Propertytabsinterface) => {
  const propertyRows = [
    ...detailItems.map(({ label, value, icon }) => ({
      label,
      value,
      icon,
      capitalize: true,
      muted: false,
    })),
    {
      label: "Created by",
      value: issueDetails?.created_by ?? "Not set",
      icon: UserRound,
      capitalize: false,
      muted: issueDetails?.created_by == null,
    },
  ];
  return (
    <>
      <div className="p-1.5">
        {propertyRows.map(({ label, value, icon: Icon, capitalize, muted }) => (
          <div
            key={label}
            className="grid min-w-0 grid-cols-[92px_minmax(0,1fr)] items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Icon
                className="h-3.5 w-3.5 shrink-0 text-slate-400"
                strokeWidth={1.75}
              />
              <span className="truncate">{label}</span>
            </div>
            <p
              className={`wrap-break-word text-[13px] ${
                capitalize ? "capitalize" : ""
              } ${muted ? "font-normal text-slate-400" : "font-medium text-slate-800"}`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};
