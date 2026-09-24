import { Request, Response } from "express";
import { OrganisationService } from "../service/organisation.service";
import {
  createOrganisationSchema,
  updateOrganisationSchema,
  organisationIdParamSchema,
} from "../dto/organisation_dto";

export class OrganisationController {
  private orgService = new OrganisationService();

  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const orgs = await this.orgService.getAllOrganisations();
      return res.status(200).json(orgs);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  };

  getById = async (req: Request, res: Response): Promise<Response> => {
    const paramResult = organisationIdParamSchema.safeParse(req.params);
    if (!paramResult.success) {
      return res.status(400).json({
        message: "Invalid route parameters",
        errors: paramResult.error.flatten().fieldErrors,
      });
    }

    try {
      const org = await this.orgService.getOrganisationById(
        paramResult.data.id,
      );
      if (!org) {
        return res.status(404).json({ message: "Organisation not found" });
      }
      return res.status(200).json(org);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const bodyResult = createOrganisationSchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: bodyResult.error.flatten().fieldErrors,
      });
    }

    try {
      const newOrg = await this.orgService.createOrganisation(bodyResult.data);
      return res.status(201).json(newOrg);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const paramResult = organisationIdParamSchema.safeParse(req.params);
    if (!paramResult.success) {
      return res.status(400).json({
        message: "Invalid route parameters",
        errors: paramResult.error.flatten().fieldErrors,
      });
    }

    const bodyResult = updateOrganisationSchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: bodyResult.error.flatten().fieldErrors,
      });
    }

    try {
      const updatedOrg = await this.orgService.updateOrganisation(
        paramResult.data.id,
        bodyResult.data,
      );

      if (!updatedOrg) {
        return res.status(404).json({ message: "Organisation not found" });
      }

      return res.status(200).json(updatedOrg);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const paramResult = organisationIdParamSchema.safeParse(req.params);
    if (!paramResult.success) {
      return res.status(400).json({
        message: "Invalid route parameters",
        errors: paramResult.error.flatten().fieldErrors,
      });
    }

    try {
      const deleted = await this.orgService.deleteOrganisation(
        paramResult.data.id,
      );
      if (!deleted) {
        return res.status(404).json({ message: "Organisation not found" });
      }
      return res
        .status(200)
        .json({ message: "Organisation deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  };
}
