import { AppDataSource } from "../data-source";
import { Issues } from "../entity/Issue";
import type { create_issue_dto, create_issue_dto_type } from "../dto/issue_dto";
import { Teams } from "../entity/Teams";
import { User } from "../entity/User";
import { Projects } from "../entity/Project";
import { Updates } from "@/entity/Updates";
class issueService {
  private issueRepository = AppDataSource.getRepository(Issues);
  private teamRepository = AppDataSource.getRepository(Teams);
  private userRepository = AppDataSource.getRepository(User);
  private projectRepository = AppDataSource.getRepository(Projects);
  private updatesRepository = AppDataSource.getRepository(Updates);
  async createIssue(issue: create_issue_dto_type) {
    //    const issueInstance = this.issueRepository.create(issue);
    const user = issue.assignee
      ? await this.userRepository.findOneBy({ email: issue.assignee })
      : null;
    const team = issue.team
      ? await this.teamRepository.findOneBy({ name: issue.team })
      : null;
    const project =
      issue.project !== -1
        ? await this.projectRepository.findOneBy({
            id: Number(issue.project),
          })
        : null;
    const issueInstance = {
      ...issue,
      created_at: new Date(),
      description: issue.description,
      lable: issue.label,
      assignee: user,
      team: team,
      project: project,
    };
    const createIssue = await this.issueRepository.save(issueInstance);
    return createIssue;
  }

  async getAllIssues(userId: number) {
    try {
      const issueList = await this.issueRepository.find({
        where: { created_by: userId },
        relations: {
          project: true,
        },
      });
      return issueList;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async deleteIssue(issueId: number) {
    const deleteIssue = await this.issueRepository
      .createQueryBuilder("Issues")
      .delete()
      .where("issue_id =: issueId", { issueId })
      .execute();
    return deleteIssue;
  }

  async updateIssue(issueId: number, issue: create_issue_dto_type) {
    console.log("updating service was triggered");
    const existingIssue = await this.issueRepository.find({
      where: { issue_id: issueId },
    });
    const updateIssue = { ...existingIssue[0], ...issue };
    const { assignee, team, project, ...scalarFields } = issue;
    const issueUpdated = await this.issueRepository.update(
      issueId,
      scalarFields,
    );
    return issueUpdated;
  }

  async findIssue(issueId?: number | null, title?: string) {
    try {
      const whereCondition = issueId ? { issue_id: issueId } : { title: title };
      const issue = await this.issueRepository.findOne({
        where: whereCondition,
        relations: {
          issue_updates: {
            updated_by: true,
          },
        },
      });
      return issue;
    } catch (err) {
      console.log("Issue with id ", issueId, " not found ");
      throw err;
    }
  }

  async findIssuePerTeam(teamId: number) {
    const teamIssueList = await this.issueRepository
      .createQueryBuilder("Issues")
      .leftJoin("Issues.team", "team")
      .where("team.team_id = :teamId", { teamId })
      .getMany();
    return teamIssueList;
  }

  async findIssuePerUser(userId: number) {
    const userIssueList = await this.issueRepository
      .createQueryBuilder("Issues")
      .leftJoin("Issues.assignee", "assignee")
      .where("assignee.user_id =: userId", { userId })
      .getMany();
    return userIssueList;
  }

  async findIssuePerProject(projectId: number) {
    const projectIssueList = await this.issueRepository
      .createQueryBuilder("issues")
      .leftJoin("issues.project", "project")
      .where("project.id = :projectId", { projectId })
      .getMany();
    return projectIssueList;
  }

  async commentIssue(
    userId: number,
    comment: string,
    issueId: string,
    asset_url?: string,
  ) {
    try {
      const update = await this.updatesRepository.save({
        updated_by: { user_id: userId },
        update_comment: comment,
        update_asset: asset_url || null,
        issues: { issue_id: Number(issueId) },
      });
      return update;
    } catch (err) {
      throw err;
    }
  }
}
export { issueService };
