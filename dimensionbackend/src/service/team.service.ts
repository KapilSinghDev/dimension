import { length } from "zod";
import { AppDataSource } from "../data-source";
import { create_team_dto_type } from "../dto/team_dto";
import { Teams } from "../entity/Teams";
import { User } from "../entity/User";
import authenticationService from "./authentication.service";
import { issueService } from "./issues.service";
import { team_status_enum } from "../../enums";
export class teamService {
  teamRepostiory = AppDataSource.getRepository(Teams);
  userRepository = AppDataSource.getRepository(User);
  authService = new authenticationService();
  issueService = new issueService();
  createTeam = async (team: create_team_dto_type, user_id: number) => {
    const member =
      team?.members?.length != 0
        ? await Promise.all(
            team.members.map((email) =>
              this.userRepository.findOneBy({ email: email }),
            ),
          )
        : [];
    const issues =
      team?.issues.length != 0
        ? await Promise.all(
            team.issues.map((issueId) => this.issueService.findIssue(issueId)),
          )
        : [];

    const newTeam = this.teamRepostiory.create({
      name: team.name,
      status: team.status ?? team_status_enum.ACTIVE,
      issue_assigned: issues,
      members: member,
      timezone: team.timezones,
      admin: { user_id },
    });
    const saveTeam = await this.teamRepostiory.save(newTeam);
    return saveTeam;
  };

  updateTeam = async (team: create_team_dto_type, id: string) => {
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
    if (team.status !== undefined) {
      teamUpdate.status = team.status;
    }
    const update = await this.teamRepostiory.save(teamUpdate);
    return update;
  };

  findTeam = async (id: string) => {
    const team = await this.teamRepostiory.findOne({
      where: { team_id: id },
      relations: {
        members: true,
        admin: true,
        // organisation: true,
        issue_assigned: true,
      },
    });
    return team;
  };
  findallTeams = async (offset: number, limit: number) => {
    const [teams, total] = await this.teamRepostiory
      .createQueryBuilder("team")
      .loadRelationCountAndMap("team.memberCount", "team.members")
      .loadRelationCountAndMap("team.issueCount", "team.issue_assigned")
      .orderBy("team.team_id", "ASC")
      .skip(offset)
      .take(limit)
      .getManyAndCount();
    const data = teams.map((team) => {
      const countedTeam = team as Teams & {
        memberCount?: number;
        issueCount?: number;
      };
      return {
        ...team,
        timezone: team.timezone ?? null,
        memberCount: countedTeam.memberCount ?? 0,
        issueCount: countedTeam.issueCount ?? 0,
      };
    });

    return { data, total };
  };
  deleteTeam = async (id: string) => {
    const deleteTeam = await this.teamRepostiory.delete({ team_id: id });
    return deleteTeam;
  };
}
