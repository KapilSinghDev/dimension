import { Router, Express } from "express";
import { ResourceController } from "@/controllers/resource.controller";
import { authorise } from "@/middleware/authorise";

export class ResourceRouter {
  private router: Router;
  private controller: ResourceController;

  constructor() {
    this.router = Router();
    this.controller = new ResourceController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/resource", this.controller.getResource);
    this.router.patch("/resource", this.controller.updateResource);
    this.router.delete("/resource", this.controller.deleteResource);
    this.router.post("/resource", authorise, this.controller.createResource);
    this.router.get("/resource/batch", this.controller.getProjectsByBatch);
  }

  public getRouter() {
    return this.router;
  }
}
