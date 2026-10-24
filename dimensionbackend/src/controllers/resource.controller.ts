import { Request, Response, NextFunction } from "express";
import { ResourceServices } from "@/service/resource.service";
import { UUID } from "node:crypto";

export class ResourceController {
  private resourceService = new ResourceServices();

  createResource = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const created = await this.resourceService.createResource(req.body);
      return res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  };

  getResource = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.query;
      console.log("resource id", id);
      if (!id) {
        return res.status(400).json({ error: "Resource id is required" });
      }

      const resource = await this.resourceService.fetchResource(id as UUID);

      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }

      return res.status(200).json(resource);
    } catch (err) {
      next(err);
    }
  };

  updateResource = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { resource_name, resource_content, resource_image } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Resource id is required" });
      }

      const updated = await this.resourceService.updateResource(id as UUID, {
        resource_name,
        resource_content,
        resource_image,
      });

      if (!updated) {
        return res.status(404).json({ error: "Resource not found" });
      }

      return res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  };

  deleteResource = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Resource id is required" });
      }

      const deleted = await this.resourceService.deleteResource(id as UUID);

      if (!deleted) {
        return res.status(404).json({ error: "Resource not found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Resource deleted" });
    } catch (err) {
      next(err);
    }
  };

  getProjectsByBatch = async (req: Request, res: Response) => {
    try {
      const { page } = req.query;
      if (!page) {
        return res.status(400).json({ error: "Page is required" });
      }
      const document_batch = await this.resourceService.fetchResourceByBatch(
        Number(page),
      );
      return res.status(200).json(document_batch);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "An error occured" });
    }
  };
}
