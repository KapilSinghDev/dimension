import Image from "next/image";
// adjust to wherever your asset lives
import no_issues from "@/assets/emptystates/no_issues.svg";
// adjust to your actual path
import FastCreateIssue from "@/components/Fastcreateissue";

export function IssuesEmptyState({
  createIssue,
  data,
  setIsCreating,
}: {
  createIssue: string;
  data?: unknown[];
  setIsCreating: (value: "true" | "false") => void;
}) {
  const isEmpty = data?.length === 0;
  const showIllustration = createIssue === "false" || isEmpty;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4">
      {/*
        Collapses smoothly (height + opacity) instead of popping out.
        grid-rows 1fr -> 0fr animates to the content's natural height.
      */}
      <div
        aria-hidden={!showIllustration}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          showIllustration
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col items-center pb-8 pt-12 text-center">
            {/* Illustration with a soft halo behind it */}
            <div className="relative mb-6">
              <div className="absolute inset-0 -z-10 scale-125 rounded-full bg-slate-200/60 blur-2xl dark:bg-slate-800/60" />
              <Image
                src={no_issues}
                alt=""
                width={150}
                height={150}
                priority
                className="object-contain opacity-90"
              />
            </div>

            <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {isEmpty ? "No issues yet" : "Start a new issue"}
            </h3>
            <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {isEmpty
                ? "Track bugs, tasks and ideas for this project. Add your first issue below."
                : "Describe what needs to be done and add it to the project."}
            </p>
          </div>
        </div>
      </div>

      {/* Create box */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-2 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow focus-within:border-slate-300 focus-within:shadow-md focus-within:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950 dark:focus-within:border-slate-700">
        <FastCreateIssue
          onOpen={() => setIsCreating("true")}
          onCancel={() => setIsCreating("false")}
        />
      </div>
    </div>
  );
}
