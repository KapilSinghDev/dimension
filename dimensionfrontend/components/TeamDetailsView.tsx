"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight,
  CircleDot,
  Clock,
  Flame,
  Globe,
  ListChecks,
  Users,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  TeamDetailsViewProps,
  TeamIssue,
  TeamUser,
} from "@/app/workspace/team/[slug]/types";
import { AvatarStack } from "./team/AvatarStack";
import { EmptyState } from "./team/EmptyState";
import { IssueRow } from "./team/IssueRow";
import { MemberRow } from "./team/MemberRow";
import { PropertyRow } from "./team/PropertyRow";
import { StatCard } from "./team/StatCard";
import { UserAvatar } from "./team/UserAvatar";
import { CLOSED, fullName, norm, toTitle, tzParts } from "./team/team-utils";

const TEAMS_HREF = "/teams";
const EMPTY_MEMBERS: TeamUser[] = [];
const EMPTY_ISSUES: TeamIssue[] = [];

export function TeamDetailsView({ team }: TeamDetailsViewProps) {
  const members = team.members ?? EMPTY_MEMBERS;
  const issues = team.issue_assigned ?? EMPTY_ISSUES;

  const membersById = useMemo(
    () => new Map(members.map((member) => [member.user_id, member])),
    [members],
  );

  const sortedIssues = useMemo(
    () =>
      [...issues].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [issues],
  );

  const prefix = useMemo(
    () =>
      team.name
        .replace(/[^a-z0-9]/gi, "")
        .slice(0, 3)
        .toUpperCase() || "TEAM",
    [team.name],
  );

  const stats = useMemo(() => {
    const open = issues.filter((issue) => !CLOSED.has(norm(issue.status)));
    return {
      open: open.length,
      urgent: open.filter((issue) =>
        ["high", "urgent"].includes(norm(issue.priority)),
      ).length,
    };
  }, [issues]);

  const timezone = team.timezone ? tzParts(team.timezone) : null;
  const isActive = norm(team.status) === "active";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:py-10">
        <header className="flex flex-col gap-5">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-sm text-muted-foreground"
          >
            <Link
              href={TEAMS_HREF}
              className="transition-colors hover:text-foreground"
            >
              Teams
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate font-medium text-foreground">
              {team.name}
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-sm font-semibold">
              {team.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="truncate text-xl font-semibold leading-none tracking-tight sm:text-2xl">
                {team.name}
              </h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium tabular-nums">{prefix}</span>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {toTitle(team.status)}
                </span>
              </div>
            </div>
          </div>
        </header>

        <section
          aria-label="Team summary"
          className="grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          <StatCard label="Members" value={members.length} icon={Users} />
          <StatCard
            label="Total issues"
            value={issues.length}
            icon={ListChecks}
          />
          <StatCard label="Open issues" value={stats.open} icon={CircleDot} />
          <StatCard
            label="High priority open"
            value={stats.urgent}
            icon={Flame}
          />
        </section>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <Tabs defaultValue="issues" className="min-w-0 gap-4">
            <TabsList className="h-auto w-full justify-start gap-5 rounded-none border-b bg-transparent p-0">
              {[
                { value: "issues", label: "Issues", count: issues.length },
                { value: "members", label: "Members", count: members.length },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="-mb-px h-10 flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 text-muted-foreground shadow-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  {tab.label}
                  <span className="ml-1.5 rounded-md bg-muted px-1.5 text-xs tabular-nums">
                    {tab.count}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="issues" className="mt-0">
              <Card className="overflow-hidden p-0 shadow-none">
                {sortedIssues.length === 0 ? (
                  <EmptyState
                    icon={ListChecks}
                    text="No issues assigned to this team yet."
                  />
                ) : (
                  <ul className="divide-y">
                    {sortedIssues.map((issue) => (
                      <IssueRow
                        key={issue.issue_id}
                        issue={issue}
                        prefix={prefix}
                        creator={membersById.get(issue.created_by)}
                      />
                    ))}
                  </ul>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="members" className="mt-0">
              <Card className="overflow-hidden p-0 shadow-none">
                {members.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    text="This team has no members yet."
                  />
                ) : (
                  <ul className="divide-y">
                    {members.map((member) => (
                      <MemberRow
                        key={member.user_id}
                        user={member}
                        isAdmin={team.admin?.user_id === member.user_id}
                      />
                    ))}
                  </ul>
                )}
              </Card>
            </TabsContent>
          </Tabs>

          <aside className="order-first lg:order-last">
            <Card className="gap-0 p-4 shadow-none lg:sticky lg:top-6">
              <h2 className="pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Properties
              </h2>
              <Separator />
              <div className="divide-y">
                <PropertyRow label="Status">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {toTitle(team.status)}
                </PropertyRow>

                <PropertyRow label="Admin">
                  {team.admin ? (
                    <>
                      <UserAvatar user={team.admin} />
                      <span className="truncate">{fullName(team.admin)}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                </PropertyRow>

                <PropertyRow label="Members">
                  {members.length ? (
                    <AvatarStack users={members} />
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </PropertyRow>

                <PropertyRow label="Timezone">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate">
                    {team.timezone
                      ? team.timezone.replace(/_/g, " ")
                      : "Not set"}
                  </span>
                </PropertyRow>

                {timezone && (
                  <PropertyRow label="Local time">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="tabular-nums">{timezone.time}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {timezone.offset}
                    </span>
                  </PropertyRow>
                )}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
