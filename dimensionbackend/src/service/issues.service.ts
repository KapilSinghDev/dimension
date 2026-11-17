import { AppDataSource } from "../data-source";
import { Issues } from "../entity/Issue";
import type { create_issue_dto, create_issue_dto_type } from "../dto/issue_dto";
import { Teams } from "../entity/Teams";
import { User } from "../entity/User";
import { Projects } from "../entity/Project";
import { Updates } from "@/entity/Updates";
import { ProjectService } from "./project.service";
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
      issue.project !== -1 &&
      issue.project !== null &&
      issue.project !== undefined
        ? await this.projectRepository.findOneBy({
            id:
              typeof issue.project === "number"
                ? issue.project
                : Number(issue.project),
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

  async updateIssue(
    issueId: number,
    issue: create_issue_dto_type,
    projectId?: string,
  ) {
    // FIX 1: Use findOne instead of find()[0] and validate the issue exists before updating
    const existingIssue = await this.issueRepository.findOne({
      where: { issue_id: issueId },
    });
    if (!existingIssue) {
      throw new Error(`Issue with ID ${issueId} not found`);
    }

    // FIX 2: Only query projectRepository if projectId is actually provided (avoids querying where: { id: NaN })
    // Also removed heavy nested relations since we only need the Project entity reference to set the foreign key
    let tarproject = undefined;
    const resolvedProjectId = projectId ?? (issue as any).projectId;

    if (resolvedProjectId) {
      tarproject = await this.projectRepository.findOne({
        where: { id: Number(resolvedProjectId) },
      });
      if (!tarproject) {
        throw new Error(`Project with ID ${resolvedProjectId} not found`);
      }
      console.log(tarproject);
    }

    // FIX 3: Destructure `issue_updates` and `projectId` out of `issue` so `scalarFields`
    // contains ONLY scalar table columns (prevents TypeORM "Cannot query across one-to-many" crash)
    const {
      issue_updates,
      projectId: _ignoredProjectId,
      assignee,
      team,
      project,
      ...scalarFields
    } = issue as any;
    const issueUpdated = await this.issueRepository.update(
      { issue_id: issueId },
      {
        ...scalarFields,
        ...(tarproject ? { project: tarproject } : {}),
      },
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
          project: true,
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
