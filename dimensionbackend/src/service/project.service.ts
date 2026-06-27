import { AppDataSource } from "../data-source";
import { Projects } from "../entity/Project";
import { project_dto } from "../dto/project_dto";
import * as z from "zod";
import { issueService } from "./issues.service";
export class ProjectService {
  private projectRepository = AppDataSource.getRepository(Projects);
  private issueService = new issueService();
  searchProject = async (project_id: string) => {
    const target_project = await this.projectRepository.findOneBy({
      id: Number(project_id),
    });
    return target_project;
  };

  //   const date = new Date();
  //   let new_project = { ...project, create_date: date };
  //   const projectIssues = new_project.issue;
  //   const issues = [];
  //   await Promise.all(
  //     projectIssues.map(async (items, id) => {
  //       const issue = await this.issueService.findIssue(null, items.title);
  //       if (issue) {
  //         console.log("issue found");
  //         issues.push(issue);
  //       }
  //       if (!issue) {
  //         console.log("issue not found");
  //         const newIssue = await this.issueService.createIssue(items);
  //         issues.push(newIssue);
  //       }
  //     }),
  //   );
  //   delete new_project.issue;
  //   const finalProject = { ...new_project, issues: issues };
  //   // new_project.issue = issues;
  //   console.log("Project = ", new_project);
  //   const save_project = await this.projectRepository.save(finalProject);
  //   console.log("save_project = ", save_project);
  //   return save_project.id;
  // };
  createProject = async (project: z.infer<typeof project_dto>) => {
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
    target_project.priority = project.priority;
    if (project.issue) {
      target_project.issues = await Promise.all(
        project.issue.map(async (item) => {
          const issue = await this.issueService.createIssue(item);
          return issue;
        }),
      );
    }

    const update_project = await this.projectRepository.save(target_project);
    console.log("update project = >", update_project);
    return update_project.id;
  };

  deleteProject = async (project_id: number) => {
    const deleteProject = await this.projectRepository.delete(project_id);
    return deleteProject;
  };
}
