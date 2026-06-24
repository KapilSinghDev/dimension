import * as express from "express";
import { Router } from "express";
import { teamController } from "../controllers/team.controller";
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
    this.teamRouter.get("/team/:id", this.teamController.getTeam);
  };
  private getAllTeams = () => {
    this.teamRouter.get("/team", this.teamController.getAllTeams);
  };
  private createNewTeamRoute = () => {
    this.teamRouter.post("/team/create", this.teamController.createNewTeam);
  };
  private updateTeamRoute = () => {
    this.teamRouter.put("/team/update", this.teamController.updateTeam);
  };
  private deleteTeamRoute = () => {
    this.teamRouter.delete("/team/:id", this.teamController.deleteTeam);
  };

  public publishTeamRoutes() {
    return this.teamRouter;
  }
}
