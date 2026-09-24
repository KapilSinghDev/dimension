import { Router } from "express";
import { OrganisationController } from "@/controllers/organisation.controller";
import { authenticateUser } from "@/middleware/authenticate";

const organisationRouter = Router();
const controller = new OrganisationController();

organisationRouter.get("/organisation", controller.getAll);
organisationRouter.get("/organisation:id", controller.getById);
organisationRouter.post("/organisation", controller.create);
organisationRouter.patch(
  "/organisation:id",
  authenticateUser,
  controller.update,
);
organisationRouter.delete(
  "/organisation:id",
  authenticateUser,
  controller.delete,
);

export default organisationRouter;
