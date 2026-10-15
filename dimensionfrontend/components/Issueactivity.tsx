"use client";
import React, { useRef, useState } from "react";
import {
  Smile,
  MoreHorizontal,
  Maximize2,
  Download,
  Copy,
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
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useUpdateIssueActivity } from "@/hooks/apihooks";

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatarInitials: string;
    profileUrl: string;
    avatarColor?: string;
  };
  timestamp: string;
  timestampUrl: string;
  text?: string;
  image?: {
    src: string;
    alt: string;
    aspectRatio?: string;
  };
}

const mockActivities: ActivityItem[] = [
  {
    id: "comment-9a96fe91",
    user: {
      name: "kaps6singh",
      avatarInitials: "KS",
      profileUrl: "/kapslabs/profiles/kaps6singh",
      avatarColor: "bg-amber-600",
    },
    timestamp: "12h ago",
    timestampUrl:
      "/kapslabs/issue/KAP-5/complete-the-issue-page-today#comment-9a96fe91",
    text: "this is a wrong photo",
    image: {
      src: "https://uploads.linear.app/f7ef4445-5894-455a-a0fa-9105ba7efb5b/3a1fd17d-b145-4c07-9b7d-aaf0d1453064/18d1b2a3-2535-4852-b582-469444d4cf3e",
      alt: "Issue screenshot preview",
      aspectRatio: "aspect-[2816/1536]",
    },
  },
];

const IssueActivity = () => {
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
    console.log(activity);
    updateActivity.mutate(activity);
  };
  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-6 text-slate-800 bg-white min-h-screen flex flex-col justify-between">
      <div className="space-y-4 flex-1">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Activity
        </h2>

        {mockActivities.map((act) => (
          <div
            key={act.id}
            id={act.id}
            className="group relative flex gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50/70 transition-all duration-200"
          >
            {/* Avatar */}
            <a href={act.user.profileUrl} className="flex-shrink-0 mt-0.5">
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold text-white ${act.user.avatarColor || "bg-slate-500"}`}
              >
                {act.user.avatarInitials}
              </div>
            </a>

            {/* Content Container */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <a
                    href={act.user.profileUrl}
                    className="font-semibold text-slate-900 hover:underline"
                  >
                    {act.user.name}
                  </a>
                  <span className="text-slate-300">•</span>
                  <a
                    href={act.timestampUrl}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    {act.timestamp}
                  </a>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    title="Add reaction"
                    className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
                  >
                    <Smile size={14} />
                  </button>
                  <button
                    title="More options"
                    className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>

              {act.image && (
                <div className="relative max-w-xl group/image rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-md p-1 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 z-10 shadow-sm">
                    <button
                      title="View Image"
                      className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                    >
                      <Maximize2 size={14} />
                    </button>
                    <button
                      title="Download"
                      className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      title="Copy Image"
                      className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      title="Copy Link"
                      className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                    >
                      <Link2 size={14} />
                    </button>
                  </div>
                  <div
                    className={`w-full ${act.image.aspectRatio || "aspect-video"} relative`}
                  >
                    {/* Note: Ensure valid image src in production */}
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                      Image Preview
                    </div>
                  </div>
                </div>
              )}

              {act.text && (
                <p className="text-sm text-slate-700 leading-relaxed break-words font-normal">
                  {act.text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* "Leave a Reply" Box Section */}
      <div className="pt-4 border-t border-slate-100 mt-6">
        <div
          className={`flex gap-3 p-3 rounded-xl border transition-all duration-200 bg-white ${
            isFocused
              ? "border-blue-500 ring-2 ring-blue-500/10 shadow-sm"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          {/* Editor Self Avatar */}
          <div className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold text-white bg-blue-600 flex-shrink-0 mt-0.5">
            ME
          </div>

          {/* Form / Text Area Input Container */}
          <div className="flex-1 flex flex-col min-w-0">
            <Textarea
              value={activity.comment} // 👈 Tied directly to single state object
              onChange={(e) =>
                setActivity((prev) => ({ ...prev, comment: e.target.value }))
              }
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Leave a reply... (Use M to comment)"
              rows={isFocused || activity.comment ? 3 : 1}
              className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent border-0 outline-none resize-none focus:ring-0 p-0 min-h-[24px] transition-all duration-150"
            />

            {/* Editor Bottom Actions Toolbar */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 animate-fadeIn">
              {/* Text Formatting Tools */}
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
                    variant={"ghost"}
                  >
                    <Paperclip />
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

              {/* Submit Panel */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
                  Markdown supported
                </span>
                <Button
                  type="button"
                  disabled={!activity.comment.trim()}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activity.comment.trim()
                      ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
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
