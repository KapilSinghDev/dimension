import { length } from "zod";
import { AppDataSource } from "../data-source";
import { create_team_dto_type } from "../dto/team_dto";
import { Teams } from "../entity/Teams";
import { User } from "../entity/User";
import authenticationService from "./authentication.service";
import { issueService } from "./issues.service";
export class teamService {
  teamRepostiory = AppDataSource.getRepository(Teams);
  userRepository = AppDataSource.getRepository(User);
  authService = new authenticationService();
  issueService = new issueService();
  createTeam = async (team: create_team_dto_type) => {
    const member =
      team.members.length != 0
        ? await Promise.all(
            team.members.map((email) =>
              this.userRepository.findOneBy({ email: email }),
            ),
          )
        : [];
    const issues =
      team.issues.length != 0
        ? await Promise.all(
            team.issues.map((issueId) => this.issueService.findIssue(issueId)),
          )
        : [];

    const newTeam = this.teamRepostiory.create({
      name: team.name,
      issue_assigned: issues,
      members: member,
    });
    const saveTeam = await this.teamRepostiory.save(newTeam);
    return saveTeam;
  };

  updateTeam = async (team: create_team_dto_type, id: number) => {
    const member =
      team.members.length != 0
        ? await Promise.all(
            team.members.map((email) => this.authService.searchUser(email)),
          )
        : [];
    const issues =
      team.issues.length != 0
        ? await Promise.all(
            team.issues.map((issueId) => this.issueService.findIssue(issueId)),
          )
        : [];
    const teamUpdate = await this.teamRepostiory.findOneBy({ team_id: id });
    teamUpdate.name = team.name;
    teamUpdate.members = member;
    teamUpdate.issue_assigned = issues;
    const update = await this.teamRepostiory.save(teamUpdate);
    return update;
  };

  findTeam = async (id: number) => {
    const team = await this.teamRepostiory.findOneBy({ team_id: id });
    return team;
  };
  findallTeams = async () => {
    const teamList = await this.teamRepostiory.find();
    return teamList;
  };
  deleteTeam = async (id: number) => {
    const deleteTeam = await this.teamRepostiory.delete({ team_id: id });
    return deleteTeam;
  };
}
