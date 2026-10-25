"use client";

import React from "react";
import { useGetResourceByBatch } from "@/hooks/apihooks";
import { ResourceResponse } from "@/lib/response.types";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
// Soft tints for icons without an image (full class names so Tailwind keeps them)
const TINTS = [
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
];

const tintFor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++)
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return TINTS[hash % TINTS.length];
};

const ResourceTable = () => {
  const router = useRouter();
  const [resourceId, setResourceId] = useQueryState("resourceId");
  const [tab, setTab] = useQueryState("tab");
  const { data, isLoading, isError } = useGetResourceByBatch("1");

  const resourceList: ResourceResponse[] = data?.data?.[0] ?? [];
  const tiles = resourceList.slice(0, 10);

  return (
    <section className="w-full p-1">
      {isLoading && (
        <div className="flex flex-wrap gap-2" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-12 w-36 rounded-xl bg-slate-100 motion-safe:animate-pulse"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
          We couldn’t load the resources. Refresh the page to try again.
        </div>
      )}

      {!isLoading && !isError && tiles.length === 0 && (
        <div className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500 ring-1 ring-inset ring-slate-200">
          No resources yet. Documents added to this project will show up here.
        </div>
      )}

      {!isLoading && !isError && tiles.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {tiles.map((item) => {
            const name = item.resource_name || "Untitled";

            return (
              <li key={item.resource_id}>
                <button
                  type="button"
                  title={name}
                  className="group flex max-w-[7rem] items-center gap-2 rounded-lg bg-white p-1 pr-2.5 text-left ring-1 ring-slate-200 transition-colors hover:bg-slate-50 hover:ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                  onClick={() => {
                    setResourceId(item.resource_id);
                    setTab("document");
                  }}
                >
                  {/* Icon */}
                  {item.resource_image ? (
                    <Image
                      src={item.resource_image}
                      alt=""
                      loading="lazy"
                      className="h-6 w-6 shrink-0 rounded-md object-cover ring-1 ring-black/5"
                    />
                  ) : (
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${tintFor(
                        String(item.resource_id ?? name),
                      )}`}
                    >
                      {name.charAt(0).toUpperCase()}
                    </span>
                  )}

                  {/* Name */}
                  <span className="truncate text-xs font-medium text-slate-700 group-hover:text-slate-900">
                    {name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default ResourceTable;
