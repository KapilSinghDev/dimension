import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";
import { authenticateUser } from "../middleware/authenticate";

export class Projectroutes {
  project_router: Router;
  private projectController = new ProjectController();

  constructor() {
    this.project_router = Router();
    this.projectRoutesRegister();
  }

  private projectRoutesRegister() {
    this.project_router.post(
      "/project/create",
      authenticateUser,
      this.projectController.createProject,
    );

    this.project_router.put(
      "/project/update",
      authenticateUser,
      this.projectController.updateProject,
    );

    this.project_router.delete(
      "/project/delete",
      authenticateUser,
      this.projectController.deleteProject,
    );

    this.project_router.get(
      "/project/get",
      // authenticateUser,
      this.projectController.getProject,
    );

    this.project_router.get(
      "/project-batch/get",
      // authenticateUser,
      this.projectController.getProjectbyBatch,
    );
  }

  public publishProjectRoutes() {
    return this.project_router;
  }
}
