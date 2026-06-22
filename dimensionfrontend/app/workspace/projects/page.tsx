"use client";
import {
  CalendarClock,
  CircleCheck,
  Crown,
  Flame,
  LayoutGrid,
  CircleDot,
  MessageSquare,
  UsersRound,
  CircleAlert,
  Users,
  Tag,
  TableProperties,
  Activity,
  UserPlus,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import Propertiesbox from "@/components/Propertiesbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Activityviewscreen from "@/components/screens/Activityviewscreen";
import Projectviewscreen from "@/components/screens/Projectviewscreen";
import Documentscreen from "@/components/screens/Documentscreen";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";
import ProjectTable from "@/components/screens/ProjectsTablescreen";
const Projects = () => {
  const { state } = useSidebar();
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsString
      .withDefault("activity")
      .withOptions({ clearOnDefault: false }),
  );
  const [project] = useQueryState("project");
  useEffect(() => {
    if (project) {
      setTab("activity");
    }
  }, [project]);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden ">
      <div className="flex items-center gap-3 pt-5 px-8 sticky top-0 z-10 bg-white ">
        <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950 flex items-center justify-center flex-shrink-0">
          <LayoutGrid
            size={16}
            className="text-violet-600 dark:text-violet-400"
          />
        </div>
        <div className="w-full">
          <p className="text-std text-foreground leading-none">Projects</p>
          <p className="text-xs text-muted-foreground mt-0.5">All projects</p>
          <Separator className="mt-2 bg-border/80" />
        </div>
      </div>
      {!project && <ProjectTable />}
      {project && (
        <div
          className={`w-full sticky top-16 z-10 mt-4 ${state === "expanded" ? "px-16" : "px-12"} flex gap-2`}
        >
          <Tabs
            defaultValue={tab || "activity"}
            className="w-full sticky top-16 z-10"
          >
            <TabsList className="bg-transparent p-0 px-0 h-fit w-fit justify-start gap-1.5 border-none">
              <TabsTrigger
                value="activity"
                className="text-xs px-2.5 py-0.5 h-fit rounded-full border border-border bg-transparent hover:bg-muted cursor-pointer font-normal data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-transparent shadow-none transition-none"
                onClick={() => setTab("activity")}
              >
                Activity
              </TabsTrigger>

              <TabsTrigger
                value="overview"
                className="text-xs px-2.5 py-0.5 h-fit rounded-full border border-border bg-transparent hover:bg-muted cursor-pointer font-normal data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-transparent shadow-none transition-none"
                onClick={() => setTab("overview")}
              >
                Overview
              </TabsTrigger>

              <TabsTrigger
                value="issues"
                className="text-xs px-2.5 py-0.5 h-fit rounded-full border border-border bg-transparent hover:bg-muted cursor-pointer font-normal data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-transparent shadow-none transition-none"
              >
                Issues
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {project && (
        <div className="flex-1 w-full mt-2 flex flex-row  ">
          {tab === "activity" && <Projectviewscreen />}
          {tab === "overview" && <Activityviewscreen />}
          {tab === "document" && <Documentscreen />}
          <div className="h-full w-2/5 pr-10">
            <div className="h-full w-full flex flex-col gap-1 p-4">
              <Propertiesbox
                Tableicon={TableProperties}
                name="Properties"
                badge="Active"
                properties={[
                  {
                    icon: CircleDot,
                    label: "Status",
                    items: ["Urgent", "High", "Medium", "Low"],
                  },
                  {
                    icon: Flame,
                    label: "Priority",
                    items: ["Urgent", "High", "Medium", "Low"],
                  },
                  {
                    icon: Crown,
                    label: "Lead",
                    items: ["Alice", "Bob", "Charlie"],
                  },
                  {
                    icon: Users,
                    label: "Members",
                    items: ["Alice", "Bob", "Charlie"],
                  },
                  {
                    icon: CircleAlert,
                    label: "Issues",
                    items: ["MT-101", "MT-102", "MT-103"],
                  },
                  {
                    icon: CalendarClock,
                    label: "Dates",
                    items: ["This week", "This month", "Custom"],
                  },
                  {
                    icon: UsersRound,
                    label: "Teams",
                    items: ["Engineering", "Design", "Product"],
                  },
                  {
                    icon: MessageSquare,
                    label: "Slack",
                    items: ["#general", "#engineering", "#design"],
                  },
                  {
                    icon: Tag,
                    label: "Label",
                    items: ["Bug", "Feature", "Improvement", "Docs"],
                  },
                ]}
              />
              <div className="h-fit max-h-full w-full flex flex-col gap-3 mt-2 p-2 bg-gray-200">
                <div className="flex items-center gap-2">
                  <Activity size={13} className="text-muted-foreground" />
                  <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
                    Activity
                  </p>
                </div>

                <div className="flex flex-col ">
                  {[
                    {
                      icon: CircleCheck,
                      text: "Status changed to In Progress",
                      time: "2m ago",
                      color: "text-emerald-500",
                    },
                    {
                      icon: UserPlus,
                      text: "Alice was added as lead",
                      time: "1h ago",
                      color: "text-blue-500",
                    },
                    {
                      icon: MessageSquare,
                      text: "New comment by Bob",
                      time: "3h ago",
                      color: "text-violet-500",
                    },
                    {
                      icon: Tag,
                      text: "Label Bug was added",
                      time: "5h ago",
                      color: "text-amber-500",
                    },
                    {
                      icon: CalendarClock,
                      text: "Due date set to Jun 28",
                      time: "Yesterday",
                      color: "text-muted-foreground",
                    },
                    {
                      icon: Flame,
                      text: "Priority changed to High",
                      time: "2d ago",
                      color: "text-red-500",
                    },
                  ].map((a, i) => (
                    <div key={i} className="flex gap-3 group ">
                      <div className="flex flex-col items-center px-auto">
                        <div className={`mt-1 flex-shrink-0 ${a.color}`}>
                          <a.icon size={13} />
                        </div>
                        <div className="w-px flex-1 bg-border/50 mt-1 group-last:hidden" />
                      </div>
                      <div className="pb-4">
                        <p className="text-xs text-foreground leading-snug">
                          {a.text}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {a.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
