import { Router, Express } from "express";
import { ResourceController } from "@/controllers/resource.controller";

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
    this.router.post("/resource", this.controller.createResource);
  }

  public getRouter() {
    return this.router;
  }
}
