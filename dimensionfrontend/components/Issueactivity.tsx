"use client";

import React, { useRef, useState } from "react";
import {
  Smile,
  MoreHorizontal,
  Maximize2,
  Download,
  Link2,
  Bold,
  Italic,
  Link,
  List,
  Sparkles,
  SendHorizontal,
  Paperclip,
} from "lucide-react";
import { issueActivityType } from "@/lib/types";
import Image from "next/image";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useQueryState } from "nuqs";
import { useUpdateIssueActivity } from "@/hooks/apihooks";

// 1. Matches your exact backend IssueUpdate relation structure
export interface IssueUpdateType {
  update_id: number;
  update_time: string | Date;
  update_comment: string;
  update_asset?: string | null;
  updated_by?: {
    user_id: number;
    firstname: string;
    lastname?: string;
    email: string;
    created_at: string;
    picture?: string | null;
    role?: string | null;
  } | null;
}

interface ActivityProps {
  updates?: IssueUpdateType[];
}

const IssueActivity = ({ updates = [] }: ActivityProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const id = useQueryState("id");
  const [activity, setActivity] = useState<issueActivityType>({
    comment: "",
    issueId: id[0]?.toString() || "",
    media: null,
  });

  const assetRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setActivity((prev) => ({
        ...prev,
        media: files[0],
      }));
    }
  };

  const updateActivity = useUpdateIssueActivity();

  const handleActivityUpdate = () => {
    if (!activity.comment.trim() && !activity.media) return;

    updateActivity.mutate(activity, {
      onSuccess: () => {
        // Reset comment input and attached file state
        setActivity({
          comment: "",
          issueId: id[0]?.toString() || "",
          media: null,
        });
        if (assetRef.current) assetRef.current.value = "";
      },
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-6 text-slate-800 bg-white min-h-fit flex flex-col justify-between">
      <div className="space-y-4 flex-1">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Activity
        </h2>

        {/* Safe rendering check using Array.isArray fallback */}
        {(Array.isArray(updates) ? updates : []).map((act) => {
          const commentee = act.updated_by;
          const fullName = commentee
            ? `${commentee.firstname} ${commentee.lastname || ""}`.trim()
            : "Unknown User";

          const initials = commentee
            ? `${commentee.firstname?.[0] || ""}${commentee.lastname?.[0] || ""}`.toUpperCase()
            : "U";

          return (
            <div
              key={act.update_id}
              id={act.update_id.toString()}
              className="group relative flex gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50/75 transition-all duration-200"
            >
              {/* User Avatar */}
              <div className="flex-shrink-0 mt-0.5">
                {commentee?.picture ? (
                  <Image
                    src={commentee.picture}
                    alt={fullName}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold text-white bg-blue-600">
                    {initials || "U"}
                  </div>
                )}
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-slate-900">
                      {fullName}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-400 text-xs">
                      {new Date(act.update_time).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      type="button"
                      title="Add reaction"
                      className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
                    >
                      <Smile size={14} />
                    </button>
                    <button
                      type="button"
                      title="More options"
                      className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>

                {/* Comment Body */}
                {act.update_comment && (
                  <p className="text-sm text-slate-700 leading-relaxed break-words font-normal">
                    {act.update_comment}
                  </p>
                )}

                {/* Asset / Image Attachment */}
                {act.update_asset && (
                  <div className="relative max-w-xl group/image rounded-lg overflow-hidden border border-slate-200 bg-slate-50 mt-2">
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-md p-1 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 z-10 shadow-sm">
                      <a
                        href={act.update_asset}
                        target="_blank"
                        rel="noreferrer"
                        title="View Full Size"
                        className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                      >
                        <Maximize2 size={14} />
                      </a>
                      <a
                        href={act.update_asset}
                        download
                        target="_blank"
                        rel="noreferrer"
                        title="Download"
                        className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                      >
                        <Download size={14} />
                      </a>
                      <button
                        type="button"
                        title="Copy Link"
                        onClick={() =>
                          navigator.clipboard.writeText(act.update_asset!)
                        }
                        className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                      >
                        <Link2 size={14} />
                      </button>
                    </div>

                    <div className="w-full relative min-h-[200px] aspect-video bg-slate-100 flex items-center justify-center">
                      <img
                        src={act.update_asset}
                        alt="Issue attachment"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply Input Box */}
      <div className="pt-4 border-t border-slate-100 mt-6">
        <div
          className={`flex gap-3 p-3 rounded-xl border transition-all duration-200 bg-white ${
            isFocused
              ? "border-blue-500 ring-2 ring-blue-500/10 shadow-sm"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold text-white bg-blue-600 flex-shrink-0 mt-0.5">
            ME
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <Textarea
              value={activity.comment}
              onChange={(e) =>
                setActivity((prev) => ({ ...prev, comment: e.target.value }))
              }
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Leave a reply..."
              rows={isFocused || activity.comment ? 3 : 1}
              className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent border-0 outline-none resize-none focus:ring-0 p-0 min-h-[24px] transition-all duration-150"
            />

            {/* Attached file preview tag */}
            {activity.media && (
              <div className="flex items-center gap-2 mt-2 px-2.5 py-1 bg-slate-100 rounded-md text-xs text-slate-600 w-fit">
                <Paperclip size={12} />
                <span className="truncate max-w-[200px]">
                  {activity.media.name}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActivity((prev) => ({ ...prev, media: null }))
                  }
                  className="text-slate-400 hover:text-red-600 ml-1 font-bold"
                >
                  ×
                </button>
              </div>
            )}

            {/* Toolbar Footer */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 animate-fadeIn">
              <div className="flex items-center gap-0.5 -ml-1">
                <button
                  type="button"
                  title="Bold"
                  className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <Bold size={14} />
                </button>
                <button
                  type="button"
                  title="Italic"
                  className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <Italic size={14} />
                </button>
                <button
                  type="button"
                  title="Add Link"
                  className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <Link size={14} />
                </button>
                <button
                  type="button"
                  title="Bullet List"
                  className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <List size={14} />
                </button>
                <span className="w-px h-4 bg-slate-200 mx-1" />
                <div>
                  <input
                    type="file"
                    ref={assetRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    title="Attach asset"
                    className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition flex items-center gap-1 text-xs h-auto"
                    onClick={() => assetRef.current?.click()}
                    variant="ghost"
                  >
                    <Paperclip size={14} />
                  </Button>
                </div>
                <button
                  type="button"
                  title="AI Copilot"
                  className="p-1.5 rounded text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 transition"
                >
                  <Sparkles size={14} />
                </button>
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
                  Markdown supported
                </span>
                <Button
                  type="button"
                  disabled={!activity.comment.trim() && !activity.media}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activity.comment.trim() || activity.media
                      ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm cursor-pointer"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                  onClick={handleActivityUpdate}
                >
                  <span>Comment</span>
                  <SendHorizontal size={12} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueActivity;
