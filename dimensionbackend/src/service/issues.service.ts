import { AppDataSource } from "../data-source";
import { Issues } from "../entity/Issue";
import type { create_issue_dto, create_issue_dto_type } from "../dto/issue_dto";
import { Teams } from "../entity/Teams";
import { User } from "../entity/User";
class issueService {
  private issueRepository = AppDataSource.getRepository(Issues);
  private teamRepository = AppDataSource.getRepository(Teams);
  private userRepository = AppDataSource.getRepository(User);

  async createIssue(issue: create_issue_dto_type) {
    //    const issueInstance = this.issueRepository.create(issue);
    const user = issue.assignee
      ? await this.userRepository.findOneBy({ email: issue.assignee })
      : null;
    const team = issue.team
      ? await this.teamRepository.findOneBy({ name: issue.team })
      : null;
    const issueInstance = {
      ...issue,
      created_at: new Date(),
      assignee: user,
      team: team,
    };
    const createIssue = await this.issueRepository.save(issueInstance);
    return createIssue;
  }

  async getAllIssues() {
    try {
      const issueList = this.issueRepository.find();
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
    const existingIssue = await this.issueRepository.find({
      where: { issue_id: issueId },
    });
    const updateIssue = { ...issue, ...existingIssue };
    const issueUpdated = await this.issueRepository.save(updateIssue);
    return issueUpdated;
  }

  async findIssue(issueId?: number | null, title?: string) {
    try {
      if (issueId && issueId != null) {
        const issue = await this.issueRepository.findOneBy({
          issue_id: issueId,
        });
        return issue;
      } else {
        const issue = await this.issueRepository.findOneBy({
          title: title,
        });
        return issue;
      }
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
}
export { issueService };
