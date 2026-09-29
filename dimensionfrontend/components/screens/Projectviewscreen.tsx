"use client";

import {
  CalendarClock,
  CircleCheck,
  Crown,
  Flame,
  Plus,
  Paperclip,
  ArrowRight,
  Save,
  ChevronDownIcon,
  CalendarDays,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { Boxes } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { useSidebar } from "@/components/ui/sidebar";
import ProjectTabs from "@/components/ProjectTabs";
import Update from "@/components/Update";
import Addtarget from "@/components/Addtarget";
import Issuedisplay from "@/components/Issuedisplay";
import { useQueryState } from "nuqs";
import {
  useCreateProject,
  useGetProjects,
  useUpdateProject,
} from "@/hooks/apihooks";
import { project_type } from "@/lib/types";
import {
  project_health_enum,
  project_priority_enum,
  project_status_enum,
} from "@/lib/enums";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { DatePickerSimple } from "../Pickdates";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { project_route } from "@/lib/routes";
const Projectviewscreen = () => {
  const { state } = useSidebar();
  const [tab, setTab] = useQueryState("tab");
  const [project, setProject] = useQueryState("project");
  const router = useRouter();

  const [datePopOver, setDatepopOver] = useState<boolean>(false);
  const [projectTargetDate, setProjectTargetDate] = useState<Date>();

  const { projects, isLoading, error } = useGetProjects(project as string);
  const projectDetail = projects;
  const [projectInterface, setProjectInterface] = useState<project_type>({
    title: projectDetail?.title || "",
    description: projectDetail?.description || "",
    target_date: projectTargetDate,
    health: project_health_enum.ON_TRACK,
    priority: (projectDetail?.priority as project_priority_enum) || null,
    status: (projectDetail?.status as project_status_enum) || null,
    issue: projectDetail?.issues || null,
  });
  useEffect(() => {
    if (projectDetail) {
      setProjectInterface({
        title: projectDetail.title || "",
        description: projectDetail.description || "",
        target_date: projectTargetDate,
        health: project_health_enum.ON_TRACK,
        priority: projectDetail.priority as project_priority_enum,
        status: projectDetail.status as project_status_enum,
        issue: projectDetail.issues,
      });
    }
  }, [projectDetail]);
  function handleProjectFieldUpdate<k extends keyof project_type>(
    field: k,
    value: project_type[k],
    e?: ChangeEvent<HTMLTextAreaElement>,
  ) {
    e?.preventDefault();
    const newValue = e ? (e.target.value as project_type[k]) : value;
    setProjectInterface((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  }
  const createProject = useCreateProject();
  const updateProject = useUpdateProject(project as string);
  function updateAndSaveProject() {
    if (project === "new") {
      createProject.mutate(projectInterface);
    } else {
      console.log("updating project interfacev => ", projectInterface);
      updateProject.mutate(projectInterface);
    }
  }
  return (
    <>
      <div
        className={`h-full w-3/5 flex flex-col items-start ${state === "expanded" ? "px-15" : "px-30"} overflow-y-auto`}
      >
        <div className="w-full flex items-center justify-between gap-4 pt-5">
          {/* Left Section: Big Icon + Auto-sizing Textarea */}
          <div className="flex items-center gap-3.5 flex-1 max-w-2xl">
            <div className="flex items-center justify-center p-2.5 rounded-xl bg-muted/60 text-muted-foreground border border-border/50 shrink-0">
              <Boxes className="h-9 w-9 text-foreground" />
            </div>
            <Textarea
              rows={1}
              defaultValue={projectDetail?.title}
              placeholder="Title for your project..."
              className="text-2xl font-bold text-foreground border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none p-0 h-auto min-h-0 leading-tight placeholder:text-muted-foreground/50"
              onBlur={(e) => handleProjectFieldUpdate("title", e.target.value)}
              // ref={titleRef}
            />
          </div>

          <Button
            size="sm"
            className="h-9 gap-2 px-4 text-xs font-semibold shadow-sm shrink-0"
            onClick={() => updateAndSaveProject()}
          >
            <Save className="h-4 w-4" />
            {project === "new" ? "Save Project" : "Update"}
          </Button>
        </div>

        <Separator className="mt-2 bg-border/80" />
        <Textarea
          className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none mt-2 font-medium"
          placeholder="Add a short summary"
          maxLength={50}
          // ref={descriptionRef}
          onBlur={(e) =>
            handleProjectFieldUpdate("description", e.target.value)
          }
        />
        <div className="h-fit flex flex-wrap gap-2">
          {[
            {
              icon: Flame,
              name:
                projects?.priority ||
                projectInterface.priority ||
                "Assign Priority",
              variant: "high" as const,
              optionField: "priority" as keyof project_type,
              options: [
                { name: "High", value: project_priority_enum.HIGH },
                { name: "Medium", value: project_priority_enum.MEDIUM },
                { name: "Low", value: project_priority_enum.LOW },
              ],
              onSelectOption: handleProjectFieldUpdate,
            },
            { icon: Crown, name: "Team Lead", variant: "lead" as const },
            {
              icon: CalendarDays,
              name:
                // format(projects?.taget_date as string, "PPP")

                projects?.taget_date ||
                projectInterface.target_date ||
                "Set Target",
              variant: "completed" as const,
              component: (
                <Popover open={datePopOver} onOpenChange={setDatepopOver}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!projectTargetDate}
                      className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                    >
                      {projectTargetDate ? (
                        format(projectTargetDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={projectTargetDate}
                      onSelect={(date) => {
                        if (date) {
                          setProjectTargetDate(date);
                          handleProjectFieldUpdate("target_date", date);
                        }
                        setDatepopOver(false);
                      }}
                      defaultMonth={projectTargetDate}
                    />
                  </PopoverContent>
                </Popover>
              ),
            },
            {
              icon: CircleCheck,
              name: projects?.status || projectInterface.status || "Set Status",
              variant: "normal" as const,
              optionField: "status" as keyof project_type,
              options: [
                { name: "In Progress", value: project_status_enum.IN_PROGRESS },
                { name: "Completed", value: project_status_enum.COMPLETED },
                { name: "Backlog", value: project_status_enum.BACKLOG },
              ],
              onSelectOption: handleProjectFieldUpdate,
            },
          ].map((items, index) => (
            <ProjectTabs
              key={index}
              icon={items.icon}
              name={
                items.name instanceof Date
                  ? format(items.name, "PPP")
                  : items.name
              }
              style={items.variant}
              options={items?.options}
              optionField={items?.optionField as keyof project_type}
              component={items?.component}
              onSelectOption={(field, value) =>
                items?.onSelectOption?.(field, value)
              }
            />
          ))}
        </div>
        <div className="h-fit flex items-center justify-between gap-2 mt-4 mb-0.5">
          <Paperclip size={15} />
          <p className="text-sm font-medium text-foreground">
            Resources and Files
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground border-none"
            onClick={() => setTab("document")}
          >
            <Plus size={13} />
            Add
          </Button>
        </div>
        <Update variant="update" />
        {/* <Projectupdatemodal /> */}
        <Field className="mt-3">
          <FieldDescription>Description</FieldDescription>
          <Textarea
            placeholder="Add description"
            className="resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            maxLength={200}
            defaultValue={
              projectDetail?.description.length !== 0
                ? projectDetail?.description
                : ""
            }
            onBlur={(e) =>
              handleProjectFieldUpdate("description", e.target.value)
            }
          />
        </Field>
        <div className="w-full h-fit  min-w-0 overflow-x-auto px-1">
          {/* TODO : add the components to display the targets up here */}
          <div className="flex items-center justify-between">
            <Addtarget />
            <Button
              variant="ghost"
              size="sm"
              className="text-xs  hover:text-foreground gap-1.5 cursor-pointer"
            >
              View all
              <ArrowRight size={13} />
            </Button>
          </div>
          {/* if its a new project then no issues to display instead create an issue button is to
          be placed here
           */}
          <div className="flex  items-start gap-1.5 w-full overflow-x-auto py-1 ">
            {projectDetail?.issues.map((t, i) => (
              <Issuedisplay
                key={i}
                date={t.created_at}
                milestone={t.title}
                // desc={t.desc}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Projectviewscreen;
