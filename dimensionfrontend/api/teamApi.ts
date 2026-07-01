import { team_dto_type, create_team_dto_type } from "@/lib/types";
import { apiclient } from "./apiClient";

export class teamApi {
  getTeam(id: string) {
    return apiclient.get(`/team/${id}`);
  }

  getAllTeams() {
    return apiclient.get("/team");
  }

  createTeam(payload: create_team_dto_type) {
    return apiclient.post("/team/create", payload);
  }

  updateTeam(payload: { id: string; team: create_team_dto_type }) {
    return apiclient.put("/team/update", payload);
  }

  deleteTeam(id: string) {
    return apiclient.delete(`/team/${id}`);
  }
}
