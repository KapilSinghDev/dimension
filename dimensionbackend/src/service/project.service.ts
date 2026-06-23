import { AppDataSource } from "../data-source";
import { Projects } from "../entity/Project";
import { project_dto } from "../dto/project_dto";
import * as z from "zod";
export class ProjectService {
  private projectRepository = AppDataSource.getRepository(Projects);

  searchProject = async (project_id: string) => {
    const target_project = await this.projectRepository.findOneBy({
      id: project_id,
    });
    return target_project;
  };

  createProject = async (project: z.infer<typeof project_dto>) => {
    const date = Date.now();
    const new_project = { ...project, created_at: date };
    const save_project = await this.projectRepository.save(new_project);
    return save_project.id;
  };

  updateProject = async (
    project_id: string,
    project: z.infer<typeof project_dto>,
  ) => {
    const target_project = await this.searchProject(project_id);
    const update = { ...target_project, ...project };
    const update_project = await this.projectRepository.save(update);
    return update_project.id;
  };

  deleteProject = async (project_id: string) => {
    const deleteProject = await this.projectRepository.delete(project_id);
    return deleteProject;
  };
}
