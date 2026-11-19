"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TeamListItem } from "@/lib/response.types";
import { team_detail_route } from "@/lib/routes";

interface TeamsTableProps {
  teams: TeamListItem[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TeamsTable({
  teams,
  page,
  totalPages,
  onPageChange,
}: TeamsTableProps) {
  const router = useRouter();
  const pageNumbers = [
    ...new Set(
      [1, page - 1, page, page + 1, totalPages].filter(
        (value) => value >= 1 && value <= totalPages,
      ),
    ),
  ].sort((a, b) => a - b);

  const navigateToTeam = (teamId: string) => {
    router.push(team_detail_route(teamId));
  };
  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Team</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-27.5">Timezones</TableHead>
              <TableHead className="w-25">Issues</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow
                key={team.team_id}
                className="h-11 cursor-pointer"
                role="link"
                tabIndex={0}
                aria-label={`Open team ${team.name}`}
                onClick={() => navigateToTeam(team.team_id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigateToTeam(team.team_id);
                  }
                }}
              >
                <TableCell className="pl-6">
                  <div className="flex items-center gap-2">
                    <Users
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium">{team.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal capitalize">
                    {team.status}
                  </Badge>
                </TableCell>
                <TableCell>{team.timezone}</TableCell>
                <TableCell>{team.issueCount}</TableCell>
              </TableRow>
            ))}
            {teams.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="py-16 text-center text-sm text-muted-foreground"
                >
                  No teams yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                onClick={(event) => {
                  event.preventDefault();
                  if (page > 1) onPageChange(page - 1);
                }}
              />
            </PaginationItem>
            {pageNumbers.map((pageNumber, index) => (
              <Fragment key={pageNumber}>
                {index > 0 && pageNumber - pageNumbers[index - 1] > 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === page}
                    aria-label={`Go to page ${pageNumber}`}
                    onClick={(event) => {
                      event.preventDefault();
                      onPageChange(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              </Fragment>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={page >= totalPages}
                className={
                  page >= totalPages ? "pointer-events-none opacity-50" : ""
                }
                onClick={(event) => {
                  event.preventDefault();
                  if (page < totalPages) onPageChange(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
