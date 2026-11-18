"use client";

import * as React from "react";
import { useState } from "react";
import { Users, ChevronDown, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Reusable settings section: title + description on top, card with rows below.
 */
interface sectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}
function Section({ title, description, children }: sectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Card className="shadow-none">
        <CardContent className="p-0">{children}</CardContent>
      </Card>
    </section>
  );
}

/**
 * Row inside a settings card: label on the left, control on the right.
 */
interface RowProps {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}

function Row({ label, hint, htmlFor, children }: RowProps) {
  return (
    <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

export default function BuildTeamScreen() {
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [copyFrom, setCopyFrom] = useState("none");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ name, identifier, timezone, copyFrom });
  };

  return (
    <div className="flex min-h-screen w-full justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-[640px] flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create a new team
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a new team to manage separate cycles, workflows, and
            notifications
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Settings: icon, name, identifier, parent team */}
          <Card className="shadow-none">
            <CardContent className="p-0">
              <Row label="Icon & Name" htmlFor="name">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Choose icon"
                  className="h-7 w-7"
                >
                  <Users className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Engineering"
                  maxLength={48}
                  autoComplete="off"
                  className="h-8 w-[220px]"
                />
              </Row>

              <Separator />

              <Row
                label="Identifier"
                hint="Used as a prefix for team issues (e.g. ENG-123)"
                htmlFor="team-identifier"
              >
                <Input
                  id="team-identifier"
                  name="key"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
                  placeholder="e.g. ENG"
                  maxLength={7}
                  autoComplete="off"
                  className="h-8 w-[100px]"
                />
              </Row>

              <Separator />

              <Row label="Parent team">
                <Badge variant="secondary" className="font-normal">
                  Available on Business
                </Badge>
              </Row>
            </CardContent>
          </Card>

          {/* Team access */}
          <Section
            title="Team access"
            description="Control who can access the team and its content. Private teams are visible only to team members and workspace admins."
          >
            <Row label="Change team access">
              <Badge variant="secondary" className="gap-1 font-normal">
                <Lock className="h-3 w-3" />
                Available on Business
              </Badge>
            </Row>
          </Section>

          {/* Timezone */}
          <Section
            title="Timezone"
            description="Used for team schedules, dates, and cycle start times"
          >
            <Row label="Timezone" htmlFor="timezone-control">
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger
                  id="timezone-control"
                  aria-label="Set timezone"
                  className="h-8 w-[280px]"
                >
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">
                    GMT+5:30 – India Standard Time - Kolkata
                  </SelectItem>
                  <SelectItem value="UTC">GMT+0:00 – UTC</SelectItem>
                  <SelectItem value="Europe/London">
                    GMT+0:00 – London
                  </SelectItem>
                  <SelectItem value="America/New_York">
                    GMT-5:00 – Eastern Time - New York
                  </SelectItem>
                  <SelectItem value="America/Los_Angeles">
                    GMT-8:00 – Pacific Time - Los Angeles
                  </SelectItem>
                  <SelectItem value="Asia/Tokyo">
                    GMT+9:00 – Japan Standard Time - Tokyo
                  </SelectItem>
                </SelectContent>
              </Select>
            </Row>
          </Section>

          {/* Copy settings */}
          <Section
            title="Copy settings from existing team"
            description="Copy workflows, cycle, and team settings from another team. Team members and Slack notification settings won't be copied."
          >
            <Row label="Copy from team">
              <Select value={copyFrom} onValueChange={setCopyFrom} disabled>
                <SelectTrigger
                  aria-label="Copy from team"
                  className="h-8 w-[200px]"
                >
                  <SelectValue placeholder="Don’t copy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Don’t copy</SelectItem>
                </SelectContent>
              </Select>
            </Row>
          </Section>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" disabled={!name.trim() || !identifier.trim()}>
              Create team
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
