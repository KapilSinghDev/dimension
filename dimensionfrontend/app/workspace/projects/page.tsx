"use client";
import {
  Activity,
  CalendarClock,
  CircleAlert,
  CircleDot,
  Crown,
  FileText,
  Flame,
  LayoutGrid,
  MessageSquare,
  TableProperties,
  Tag,
  Users,
  UsersRound,
} from "lucide-react";
import { format } from "date-fns";
import { parseAsString, useQueryState } from "nuqs";
import { useSidebar } from "@/components/ui/sidebar";
import Propertiesbox from "@/components/Propertiesbox";
import Activityviewscreen from "@/components/screens/Activityviewscreen";
import Projectviewscreen from "@/components/screens/Projectviewscreen";
import Documentscreen from "@/components/screens/Documentscreen";
import ProjectTable from "@/components/screens/ProjectsTablescreen";
import { useGetProjectOverview } from "@/hooks/apihooks";
import { ProjectOverviewResponse } from "@/lib/response.types";

const TABS = [
  { value: "activity", label: "Activity", icon: Activity },
  { value: "overview", label: "Overview", icon: TableProperties },
  { value: "document", label: "Documents", icon: FileText },
];
//  to convert the first case to upper case
const prettify = (v?: string | null) =>
  v ? v.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()) : "—";
console.log("prettify", prettify);
const Projects = () => {
  const { state } = useSidebar();
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsString
      .withDefault("activity")
      .withOptions({ clearOnDefault: false }),
  );
  const [project] = useQueryState("project");

  const { data } = useGetProjectOverview(project as string, tab === "overview");
  const overView: ProjectOverviewResponse | undefined = data?.data?.message;
  const activityUpdates =
    overView?.issues?.flatMap((issue) => issue.issue_updates ?? []) ?? [];

  // same gutters as Projectviewscreen so left edges line up
  const gutter = state === "expanded" ? "px-15" : "px-30";

  // adjust to your manager shape
  // const lead = overView?.manager
  //   ? `${overView.manager.firstname ?? ""} ${overView.manager.lastname ?? ""}`.trim()
  //   : "No lead";

  const properties = [
    { icon: CircleDot, label: "Status", items: prettify(overView?.status) },
    { icon: Flame, label: "Priority", items: prettify(overView?.priority) },
    // { icon: Crown, label: "Lead", items: lead },
    { icon: Users, label: "Members", items: "—" },
    {
      icon: CircleAlert,
      label: "Issues",
      items: `${overView?.issues?.length ?? 0}`,
    },
    {
      icon: CalendarClock,
      label: "Dates",
      items: overView?.taget_date
        ? format(new Date(overView.taget_date), "MMM d, yyyy")
        : "—",
    },
    { icon: UsersRound, label: "Teams", items: "—" },
    { icon: MessageSquare, label: "Slack", items: "—" },
    { icon: Tag, label: "Label", items: "—" },
  ];

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      {/* Page header */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/60 px-8">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-100 ring-1 ring-inset ring-violet-200/60 dark:bg-violet-950 dark:ring-violet-900/50">
          <LayoutGrid
            size={16}
            className="text-violet-600 dark:text-violet-400"
          />
        </div>
        <div>
          <h1 className="text-sm font-semibold leading-none tracking-tight text-foreground">
            Projects
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">All projects</p>
        </div>
      </header>

      {/* List view */}
      {!project && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ProjectTable />
        </div>
      )}

      {/* Detail view */}
      {project && (
        <>
          {/* Tab bar */}
          <nav
            role="tablist"
            className={`flex shrink-0 items-center gap-1 border-b border-border/60 ${gutter}`}
          >
            {TABS.map((t) => {
              const active = tab === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.value)}
                  className={`relative inline-flex h-10 items-center gap-1.5 px-3 text-xs font-medium transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <t.icon size={14} />
                  {t.label}
                  {active && (
                    <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-foreground" />
                  )}
                </button>
              );
            })}

            {/* Not built yet */}
            <button
              type="button"
              disabled
              className="inline-flex h-10 cursor-not-allowed items-center gap-1.5 px-3 text-xs font-medium text-muted-foreground/50"
            >
              <Users size={14} />
              Members
              <span className="rounded bg-muted px-1 py-px text-[9px] font-medium">
                Soon
              </span>
            </button>
          </nav>

          {/* Content: each side scrolls on its own */}
          <div className="flex min-h-0 flex-1">
            {tab === "activity" && <Projectviewscreen />}
            {tab === "overview" && (
              <Activityviewscreen activity={activityUpdates} />
            )}
            {tab === "document" && <Documentscreen />}

            <aside
              className={`w-2/5 shrink-0 overflow-y-auto p-5 ${
                tab === "overview" ? "border-l border-border/60" : ""
              }`}
            >
              {tab === "overview" && (
                <Propertiesbox
                  Tableicon={TableProperties}
                  name="Properties"
                  badge="Active"
                  properties={properties}
                />
              )}
            </aside>
          </div>
        </>
      )}
    </div>
  );
};

export default Projects;
