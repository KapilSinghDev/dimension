import { AppDataSource } from "../data-source";
import { Projects } from "../entity/Project";
import { project_dto } from "../dto/project_dto";
import * as z from "zod";
import { issueService } from "./issues.service";
import authenticationService from "@/service/authentication.service";
export class ProjectService {
  private projectRepository = AppDataSource.getRepository(Projects);
  private issueService = new issueService();
  private authenticationSerive = new authenticationService();
  searchProject = async (project_id: string) => {
    const target_project = await this.projectRepository.findOneBy({
      id: Number(project_id),
    });
    return target_project;
  };

  createProject = async (
    project: z.infer<typeof project_dto>,
    email: string,
  ) => {
    const projectOwner = await this.authenticationSerive.searchUser(email);
    const issues = await Promise.all(
      (project.issue ?? []).map(async (items) => {
        const issue = await this.issueService.findIssue(null, items.title);
        if (issue) return issue;
        return await this.issueService.createIssue(items);
      }),
    );

    const new_project = this.projectRepository.create({
      title: project.title,
      description: project.description,
      health: project.health,
      priority: project.priority,
      status: project.status,
      created_by: projectOwner,
      issues,
    });

    const save_project = await this.projectRepository.save(new_project);
    return save_project.id;
  };
  updateProject = async (
    project_id: string,
    project: z.infer<typeof project_dto>,
  ) => {
    const target_project = await this.searchProject(project_id);
    target_project.title = project.title;
    target_project.description = project.description;
    target_project.priority = project.priority;
    target_project.taget_date = project.target_date;
    target_project.status = project.status;
    if (project.issue) {
      target_project.issues = await Promise.all(
        project.issue.map(async (item) => {
          const issue = await this.issueService.createIssue(item);
          return issue;
        }),
      );
    }
    console.log("before update = >", target_project);
    const update_project = await this.projectRepository.save(target_project);
    console.log("update project = >", update_project);
    return update_project.id;
  };

  deleteProject = async (project_id: number) => {
    const deleteProject = await this.projectRepository.delete(project_id);
    return deleteProject;
  };

  fetchProjectByBatch = async (page: number, email: string) => {
    const batch_size = 13;
    const skip = (page - 1) * batch_size;
    const userSearching = await this.authenticationSerive.searchUser(email);
    const projects = await this.projectRepository.findAndCount({
      take: batch_size,
      skip: Number(skip),
      where: { created_by: { user_id: userSearching.user_id } },
      relations: { created_by: true },
    });
    return projects;
  };
}
