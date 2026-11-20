import Link from "next/link";
import {
  ChevronsUpDown,
  CircleDot,
  Flag,
  FolderOpen,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import FooterComponent from "@/components/FooterComponent";
import Image from "next/image";
import Dimensionlogo from "@/assets/Dimension.svg";
/* -------------------------------------------------------------------------- */
/*  Brand mark                                                                */
/* -------------------------------------------------------------------------- */

function Mark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="1.5"
        y="6.5"
        width="12"
        height="12"
        className="stroke-zinc-950"
        strokeWidth="1.5"
      />
      <rect
        x="6.5"
        y="1.5"
        width="12"
        height="12"
        className="fill-white stroke-zinc-950"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Navbar                                                                    */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "Workflow", href: "#workflow" },
  { label: "Docs", href: "#docs" },
];

function Navbar() {
  return (
    <header className="h-14 border-b border-zinc-200 bg-white">
      <div className="mx-auto grid h-full w-full max-w-5xl grid-cols-2 items-center md:grid-cols-3">
        <Link href="/" className="flex items-center gap-2 justify-self-start">
          <Image alt="logo" width={500} src={Dimensionlogo} />
          {/* <Mark />
          <span className="font-semibold tracking-tight text-zinc-950">
            Dimension
          </span> */}
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 justify-self-center md:flex"
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-950"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <Button
            variant="ghost"
            className="h-8 px-3 text-xs text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
          >
            Sign in
          </Button>
          <Button className="h-8 bg-zinc-900 px-3 text-xs text-white hover:bg-zinc-800">
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Product preview (static)                                                  */
/* -------------------------------------------------------------------------- */

type StatusKey = "in_progress" | "in_review" | "todo" | "backlog";
type Priority = "Urgent" | "High" | "Medium" | "Low";

interface PreviewIssue {
  id: string;
  title: string;
  status: StatusKey;
  priority: Priority;
  assignee: string;
}

const STATUS: Record<StatusKey, { label: string; dot: string }> = {
  in_progress: { label: "In progress", dot: "bg-blue-600" },
  in_review: { label: "In review", dot: "bg-zinc-900" },
  todo: { label: "Todo", dot: "border border-zinc-400 bg-white" },
  backlog: { label: "Backlog", dot: "border border-zinc-300 bg-zinc-100" },
};

const ISSUES: PreviewIssue[] = [
  {
    id: "DIM-104",
    title: "Add cursor pagination to /v2/issues",
    status: "in_progress",
    priority: "High",
    assignee: "AK",
  },
  {
    id: "DIM-102",
    title: "Webhook retries drop payload on timeout",
    status: "in_review",
    priority: "Urgent",
    assignee: "SL",
  },
  {
    id: "DIM-108",
    title: "Document rate limit response headers",
    status: "todo",
    priority: "Medium",
    assignee: "JP",
  },
  {
    id: "DIM-110",
    title: "Remove deprecated /v1/teams routes",
    status: "backlog",
    priority: "Low",
    assignee: "MR",
  },
];

const SIDEBAR_ITEMS: { label: string; icon: LucideIcon; active?: boolean }[] = [
  { label: "Issues", icon: CircleDot, active: true },
  { label: "Milestones", icon: Flag },
  { label: "Resources", icon: FolderOpen },
  { label: "Teams", icon: Users },
];

function PreviewSidebar() {
  return (
    <aside className="hidden w-48 shrink-0 border-r border-zinc-200 bg-zinc-50/70 p-3 md:block">
      <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-900 text-[10px] font-semibold text-white">
          D
        </span>
        <span className="flex-1 truncate text-sm font-medium text-zinc-950">
          Dimension
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 text-zinc-500" />
      </div>

      <nav className="mt-3 flex flex-col gap-0.5" aria-hidden="true">
        {SIDEBAR_ITEMS.map(({ label, icon: Icon, active }) => (
          <div
            key={label}
            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
              active ? "bg-zinc-100 font-medium text-zinc-950" : "text-zinc-600"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function IssueRow({ issue }: { issue: PreviewIssue }) {
  const status = STATUS[issue.status];
  return (
    <li className="flex items-center gap-3 px-4 py-2.5">
      <span className="w-14 shrink-0 font-mono text-xs text-zinc-500">
        {issue.id}
      </span>
      <span className={`h-2 w-2 shrink-0 rounded-full ${status.dot}`}>
        <span className="sr-only">{status.label}</span>
      </span>
      <span className="min-w-0 flex-1 truncate text-sm text-zinc-950">
        {issue.title}
      </span>
      <span
        className={`hidden shrink-0 rounded border border-zinc-200 px-1.5 py-0.5 text-[11px] sm:inline ${
          issue.priority === "Urgent"
            ? "font-medium text-zinc-950"
            : "text-zinc-600"
        }`}
      >
        {issue.priority}
      </span>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-[10px] font-medium text-zinc-600">
        {issue.assignee}
      </span>
    </li>
  );
}

function ProductPreview() {
  return (
    <figure
      aria-label="Preview of the Dimension workspace showing the Core API v2 project"
      className="mt-14 rounded-xl border border-zinc-200 bg-zinc-50 p-2 shadow-xs"
    >
      <div className="flex overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <PreviewSidebar />

        <div className="min-w-0 flex-1">
          {/* Project header */}
          <div className="flex items-center justify-between gap-4 border-b border-zinc-200 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <span className="text-zinc-500">Projects</span>
              <span className="text-zinc-300">/</span>
              <span className="truncate font-medium text-zinc-950">
                Core API v2
              </span>
            </div>
            <span className="shrink-0 text-xs text-zinc-500">Due Dec 12</span>
          </div>

          {/* Milestone progress */}
          <div className="border-b border-zinc-200 px-4 py-4">
            <div className="flex items-baseline justify-between gap-4 text-xs">
              <span className="font-medium text-zinc-950">
                Milestone 3 · Public beta
              </span>
              <span className="font-mono text-zinc-500">14 / 20 issues</span>
            </div>
            <div
              className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={20}
              aria-valuenow={14}
              aria-label="Milestone 3 progress"
            >
              <div className="h-full w-[70%] rounded-full bg-zinc-900" />
            </div>
          </div>

          {/* Issue list */}
          <ul className="divide-y divide-zinc-200">
            {ISSUES.map((issue) => (
              <IssueRow key={issue.id} issue={issue} />
            ))}
          </ul>
        </div>
      </div>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 pb-24 pt-20">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Project &amp; issue workspace
      </p>

      <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-950 sm:text-5xl">
        Align issues, milestones, and resources in one workspace.
      </h1>

      <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
        Dimension gives engineering, product, and design teams a fast,
        structured place to track issues, manage shared resources, and ship on
        schedule.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button className="h-10 bg-zinc-900 px-5 text-sm text-white hover:bg-zinc-800">
          Start a workspace
        </Button>
        <Button
          variant="outline"
          className="h-10 border-zinc-200 bg-white px-5 text-sm text-zinc-900 hover:bg-zinc-50"
        >
          Explore live demo
        </Button>
      </div>

      <ProductPreview />
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Page() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Navbar />
      <main>
        <Hero />
      </main>
      <FooterComponent />
    </div>
  );
}
