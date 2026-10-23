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
import Memberscreen from "@/components/screens/Memberscreen";

const TABS = [
  { value: "activity", label: "Activity", icon: Activity },
  { value: "overview", label: "Overview", icon: TableProperties },
  { value: "document", label: "Documents", icon: FileText },
  { value: "members", label: "Members", icon: UsersRound },
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

  const gutter = state === "expanded" ? "px-15" : "px-30";

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
    <div className="flex h-screen w-full items-start justify-start p-1.5 bg-background">
      {/* Main Card Container */}
      <div className="flex h-full w-full flex-col overflow-hidden rounded-sm border border-border bg-card">
        {/* List View */}
        {!project && (
          <>
            {/* Header moved inside the card, directly above the table */}
            <header className="flex shrink-0 items-center gap-3   px-4 py-6 md:px-6">
              <div className="grid h-fit w-fit shrink-0 place-items-center rounded-lg bg-violet-100 ring-1 ring-inset ring-violet-200/60 dark:bg-violet-950 dark:ring-violet-900/50">
                <LayoutGrid
                  size={16}
                  className="text-violet-600 dark:text-violet-400"
                />
              </div>
              <div>
                <h1 className="text-[16px] tracking-tight text-foreground">
                  Projects
                </h1>
              </div>
            </header>

            {/* Table Content */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              <ProjectTable />
            </div>
          </>
        )}

        {/* Detail View */}
        {project && (
          <>
            {/* Tab bar */}
            <nav
              role="tablist"
              className={`flex shrink-0 items-center gap-1 border-b border-border/60 px-4 md:px-6 ${gutter}`}
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
            </nav>

            {/* Content: each side scrolls on its own */}
            <div className="flex min-h-0 flex-1">
              {tab === "activity" && <Projectviewscreen />}
              {tab === "overview" && (
                <Activityviewscreen activity={activityUpdates} />
              )}
              {tab === "document" && <Documentscreen />}
              {tab === "members" && <Memberscreen />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;
