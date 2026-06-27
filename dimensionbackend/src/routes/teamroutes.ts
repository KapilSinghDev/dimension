import * as express from "express";
import { Router } from "express";
import { teamController } from "../controllers/team.controller";
import { authenticateUser } from "../middleware/authenticate";
export class teamRoute {
  private teamRouter: Router;
  private teamController = new teamController();
  constructor() {
    this.teamRouter = express.Router();
    this.teamRoutesRegister();
  }

  private teamRoutesRegister() {
    (this.getTeams(),
      this.getAllTeams(),
      this.createNewTeamRoute(),
      this.updateTeamRoute(),
      this.deleteTeamRoute());
  }

  private getTeams = () => {
    this.teamRouter.get(
      "/team/:id",
      authenticateUser,
      this.teamController.getTeam,
    );
  };
  private getAllTeams = () => {
    this.teamRouter.get(
      "/team",
      authenticateUser,
      this.teamController.getAllTeams,
    );
  };
  private createNewTeamRoute = () => {
    this.teamRouter.post(
      "/team/create",
      authenticateUser,
      this.teamController.createNewTeam,
    );
  };
  private updateTeamRoute = () => {
    this.teamRouter.put(
      "/team/update",
      authenticateUser,
      this.teamController.updateTeam,
    );
  };
  private deleteTeamRoute = () => {
    this.teamRouter.delete(
      "/team/:id",
      authenticateUser,
      this.teamController.deleteTeam,
    );
  };

  public publishTeamRoutes() {
    return this.teamRouter;
  }
}
