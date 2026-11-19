"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TeamDetailsView } from "@/components/TeamDetailsView";
import { TeamSkeleton } from "@/components/skeleton/TeamSkeleton";
import { useGetTeamById } from "@/hooks/apihooks";
import type { TeamDetails, TeamResponse } from "./types";
import { team_rotue } from "@/lib/routes";
console.log("the team is route ", team_rotue);
/** The API wraps the team in `{ response }`; accept either shape. */
function unwrapTeam(data: unknown): TeamDetails | undefined {
  if (!data || typeof data !== "object") return undefined;
  const teamData = data as Partial<TeamResponse> & Partial<TeamDetails>;
  if (teamData.response) return teamData.response;
  return teamData.team_id ? (teamData as TeamDetails) : undefined;
}

function TeamView() {
  const params = useParams();
  const { data, isLoading, isError } = useGetTeamById(params.slug as string);

  if (isLoading) return <TeamSkeleton />;

  const team = unwrapTeam(data?.data.response);

  if (isError || !team) {
    return (
      <main className="flex min-h-screen items-start justify-center bg-background px-4 py-16">
        <div className="flex w-full max-w-md flex-col gap-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {isError ? "Couldn’t load this team" : "Team not found"}
            </AlertTitle>
            <AlertDescription>
              {isError
                ? "Something went wrong while fetching the team. Please try again."
                : "This team doesn’t exist or you don’t have access to it."}
            </AlertDescription>
          </Alert>
          <Button asChild variant="outline" className="w-fit">
            <Link href={team_rotue}>Back to teams</Link>
          </Button>
        </div>
      </main>
    );
  }

  return <TeamDetailsView team={team} />;
}

export default function ViewTeam() {
  return (
    <Suspense fallback={<TeamSkeleton />}>
      <TeamView />
    </Suspense>
  );
}
