import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";

export class Projectroutes {
  project_router: Router;
  private projectController = new ProjectController();

  constructor() {
    this.project_router = Router();
    this.projectRoutesRegister();
  }

  private projectRoutesRegister() {
    this.project_router.post("/create", this.projectController.createProject);

    this.project_router.put(
      "/project/update",
      this.projectController.updateProject,
    );

    this.project_router.delete("/delete", this.projectController.deleteProject);

    this.project_router.get("/batch-get", this.projectController.getProject);
  }

  public publishProjectRoutes() {
    return this.project_router;
  }
}
