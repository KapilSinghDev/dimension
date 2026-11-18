"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryState } from "nuqs";
import { create_team_dto_type } from "@/lib/types";
import { team_status_enum } from "@/lib/enums";

/* ------------------------------- Types ---------------------------------- */

/**
 * Only the fields the USER provides.
 *
 * Filled by the backend, never sent from the form:
 *  - team_id       -> @PrimaryGeneratedColumn
 *  - status        -> defaults to team_status_enum.ACTIVE
 *  - admin         -> the authenticated user creating the team
 *  - members       -> creator is added as the first member
 *  - organisation  -> taken from the user's organisation / session
 *  - issue_assigned-> empty until issues are assigned
 */

interface BuildTeamScreenProps {
  onBack?: () => void;
  onSubmit?: (payload: create_team_dto_type) => Promise<void> | void;
  onChangeTimezone?: (timeZone: string) => void;
  onChangeName?: (teamName: string) => void;
}

interface RowProps {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}

interface SectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

/* ----------------------------- Layout helpers --------------------------- */

function Section({ title, description, children }: SectionProps) {
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

/* ------------------------------ Timezones ------------------------------- */

interface TimezoneOption {
  value: string; // IANA name, stored in the `timezone` varchar column
  label: string;
}

function getOffsetLabel(tz: string): string {
  try {
    const part = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    })
      .formatToParts(new Date())
      .find((p) => p.type === "timeZoneName");
    return part?.value ?? "GMT";
  } catch {
    return "GMT";
  }
}

/* -------------------------------- Screen -------------------------------- */

export default function BuildTeamScreen({
  onBack,
  onSubmit,
  onChangeName,
  onChangeTimezone,
}: BuildTeamScreenProps) {
  // Auto-detect the browser timezone so the user rarely has to touch it.
  const detectedTimezone = useMemo<string>(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    [],
  );

  const timezoneOptions = useMemo<TimezoneOption[]>(() => {
    const zones: string[] =
      typeof Intl.supportedValuesOf === "function"
        ? Intl.supportedValuesOf("timeZone")
        : ["UTC"];
    return zones.map((tz) => ({
      value: tz,
      label: `${getOffsetLabel(tz)} – ${tz.replace(/_/g, " ")}`,
    }));
  }, []);

  const [name, setName] = useState<string>("");
  const [timezones, setTimezone] = useState<string>(detectedTimezone);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedName = name.trim();
  const canSubmit = trimmedName.length > 0 && !submitting;
  const [teamId, setTeamId] = useQueryState("team");
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTeamId(null);
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit?.({
        name: trimmedName,
        status: team_status_enum.ACTIVE,
        timezones: timezones,
      });
      onBack?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not create the team.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-[640px] flex-col gap-8">
        <header className="flex flex-col gap-3">
          {onBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="-ml-2 w-fit text-muted-foreground"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Teams
            </Button>
          )}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create a new team
            </h1>
            <p className="text-sm text-muted-foreground">
              Create a new team to manage separate cycles, workflows, and
              notifications
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* name (required) */}
          <Card className="shadow-none">
            <CardContent className="p-0">
              <Row label="Name" htmlFor="name">
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  onBlur={() => onChangeName?.(name)}
                  placeholder="e.g. Engineering"
                  maxLength={48}
                  autoComplete="off"
                  required
                  className="h-8 w-[260px]"
                />
              </Row>
              <Separator />
              <Row
                label="Team admin"
                hint="You’ll be set as the admin and first member of this team"
              >
                <span className="text-sm text-muted-foreground">You</span>
              </Row>
            </CardContent>
          </Card>

          {/* timezone (optional, auto-detected) */}
          <Section
            title="Timezone"
            description="Used for team schedules, dates, and cycle start times"
          >
            <Row label="Timezone" htmlFor="timezone-control">
              <Select value={timezones} onValueChange={setTimezone}>
                <SelectTrigger
                  id="timezone-control"
                  aria-label="Set timezone"
                  className="h-8 w-[320px]"
                >
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {timezoneOptions.map((tz) => (
                    <SelectItem
                      key={tz.value}
                      value={tz.value}
                      onClick={() => onChangeTimezone?.(tz.value)}
                    >
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Row>
          </Section>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={!canSubmit}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create team
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
