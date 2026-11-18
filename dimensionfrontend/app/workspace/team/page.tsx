"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  PaintBucket,
  MoreHorizontal,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ----------------------------- Types & data ----------------------------- */

type TeamStatus = "active" | "archived";
type SortKey = "name" | "visibility" | "members" | "issues" | "createdAt";
type SortDirection = "asc" | "desc";

interface Team {
  id: string;
  name: string;
  identifier: string;
  description: string;
  visibility: "Workspace" | "Private";
  members: number;
  issues: number;
  createdAt: string; // ISO date
  color: string;
  status: TeamStatus;
}

const TEAMS: Team[] = [
  {
    id: "ba64252d-4401-4705-8733-7308e276c7eb",
    name: "KapsLabs",
    identifier: "KAP",
    description: "",
    visibility: "Workspace",
    members: 1,
    issues: 5,
    createdAt: "2026-05-18T10:30:05",
    color: "#9577ff",
    status: "active",
  },
];

const COLUMNS: { key: SortKey; label: string; className?: string }[] = [
  { key: "name", label: "Name" },
  { key: "visibility", label: "Visibility", className: "w-[120px]" },
  { key: "members", label: "Members", className: "w-[92px]" },
  { key: "issues", label: "Issues", className: "w-[82px]" },
  { key: "createdAt", label: "Created", className: "w-[100px]" },
];

const formatCreated = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

/* ------------------------------ Sort header ------------------------------ */

interface SortHeadProps {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
  className?: string;
}

function SortHead({
  label,
  active,
  direction,
  onClick,
  className,
}: SortHeadProps) {
  const Icon = direction === "asc" ? ArrowDown : ArrowUp;
  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Order by ${label}${
          active
            ? `, sorted ${direction === "asc" ? "ascending" : "descending"}`
            : ""
        }`}
        className="group inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        {label}
        <Icon
          className={`h-3 w-3 transition-opacity ${
            active ? "opacity-100" : "opacity-0 group-hover:opacity-60"
          }`}
        />
      </button>
    </TableHead>
  );
}

/* --------------------------------- Screen -------------------------------- */

export default function TeamsScreen() {
  const [query, setQuery] = useState<string>("");
  const [status, setStatus] = useState<TeamStatus>("active");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const teams = useMemo<Team[]>(() => {
    const q = query.trim().toLowerCase();
    return TEAMS.filter(
      (t) =>
        t.status === status &&
        (!q ||
          t.name.toLowerCase().includes(q) ||
          t.identifier.toLowerCase().includes(q)),
    ).sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [query, status, sortKey, sortDir]);

  const handleExportCsv = () => {
    const header = [
      "Name",
      "Identifier",
      "Visibility",
      "Members",
      "Issues",
      "Created",
    ];
    const rows = teams.map((t) => [
      t.name,
      t.identifier,
      t.visibility,
      t.members,
      t.issues,
      t.createdAt,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "teams.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <main className="flex min-h-screen w-full justify-center bg-background px-6 py-8">
      <div className="flex w-full max-w-[1100px] flex-col gap-6">
        {/* Header + toolbar */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Teams</h1>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuery(e.target.value)
                }
                placeholder="Filter by name…"
                aria-label="Filter by name"
                spellCheck={false}
                autoComplete="off"
                className="h-8 w-[200px] pl-8"
              />
            </div>

            <Select
              value={status}
              onValueChange={(v: string) => setStatus(v as TeamStatus)}
            >
              <SelectTrigger aria-label="Team status" className="h-8 w-[110px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={handleExportCsv}>
              Export CSV
            </Button>
            <Button size="sm" aria-label="Create new team">
              Create team
            </Button>
          </div>
        </header>

        {/* Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {COLUMNS.map((c, i) => (
                  <React.Fragment key={c.key}>
                    <SortHead
                      label={c.label}
                      active={sortKey === c.key}
                      direction={sortDir}
                      onClick={() => handleSort(c.key)}
                      className={`${c.className ?? ""} ${i === 0 ? "pl-6" : ""}`}
                    />
                    {/* Description is a plain, non-sortable column */}
                    {c.key === "name" && (
                      <TableHead className="text-xs font-medium text-muted-foreground">
                        Description
                      </TableHead>
                    )}
                  </React.Fragment>
                ))}
                <TableHead className="w-[48px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {teams.length > 0 && (
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableCell colSpan={7} className="py-1.5 pl-6 text-sm">
                    <span className="font-medium capitalize">{status}</span>
                    <span className="ml-2 text-muted-foreground">
                      {teams.length}
                    </span>
                  </TableCell>
                </TableRow>
              )}

              {teams.map((team) => (
                <TableRow key={team.id} className="h-11 cursor-pointer">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-2">
                      <PaintBucket
                        className="h-3.5 w-3.5"
                        style={{ color: team.color }}
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium">{team.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {team.identifier}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-0 truncate text-sm text-muted-foreground">
                    {team.description}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {team.visibility}
                  </TableCell>
                  <TableCell className="text-sm">{team.members}</TableCell>
                  <TableCell className="text-sm">{team.issues}</TableCell>
                  <TableCell
                    className="text-sm text-muted-foreground"
                    title={new Date(team.createdAt).toLocaleString()}
                  >
                    {formatCreated(team.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          aria-label="Open menu"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Open team</DropdownMenuItem>
                        <DropdownMenuItem>Team settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          Archive team
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}

              {teams.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={7}
                    className="py-16 text-center text-sm text-muted-foreground"
                  >
                    {query
                      ? `No ${status} teams match “${query}”. Try a different name.`
                      : `No ${status} teams yet.`}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
