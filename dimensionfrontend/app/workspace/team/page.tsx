"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BuildTeamScreen from "@/components/screens/Buildteamscreen";
import { TeamsTable } from "@/components/TeamsTable";
import { useCreateTeam, useGetTeamList } from "@/hooks/apihooks";
import { team_status_enum } from "@/lib/enums";
import type { create_team_dto_type } from "@/lib/types";

export default function TeamsScreen() {
  const [teamId, setTeamId] = useQueryState("team");
  const [page, setPage] = useState(1);
  const [teamPayload, setTeamPayload] = useState<create_team_dto_type>({
    name: "",
    status: team_status_enum.ACTIVE,
    timezones: "",
    members: [],
    issues: [],
  });
  const createTeam = useCreateTeam();
  const { data, isLoading, isError } = useGetTeamList(page);

  const handleCreateTeam = (payload: create_team_dto_type) => {
    createTeam.mutate(payload);
  };

  return teamId === "new" ? (
    <BuildTeamScreen
      onSubmit={() => handleCreateTeam(teamPayload)}
      onChangeName={(name) =>
        setTeamPayload((previous) => ({ ...previous, name }))
      }
      onChangeTimezone={(timezone) =>
        setTeamPayload((previous) => ({ ...previous, timezones: timezone }))
      }
    />
  ) : (
    <main className="flex min-h-screen w-full justify-center bg-background px-6 py-8">
      <div className="flex w-full max-w-275 flex-col gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Teams</h1>
          <Button
            onClick={() => setTeamId("new")}
            size="sm"
            aria-label="Create new team"
          >
            Create team
          </Button>
        </header>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-11 w-full" />
            ))}
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn’t load teams</AlertTitle>
            <AlertDescription>
              Something went wrong while fetching teams. Please try again.
            </AlertDescription>
          </Alert>
        ) : (
          <TeamsTable
            teams={data?.data ?? []}
            page={page}
            totalPages={data?.totalPages ?? 0}
            onPageChange={setPage}
          />
        )}
      </div>
    </main>
  );
}
