import * as express from "express";
import { Request, Response, Router } from "express";
import { issueController } from "../controllers/issue.controller";
import { authorise } from "../middleware/authorise";
import { authenticateUser } from "../middleware/authenticate";
export class issueRouter {
  private router: Router;
  private issueController = new issueController();
  constructor() {
    this.router = express.Router();
    this.issueRoutesRegister();
  }

  private issueRoutesRegister() {
    this.getIssue();
    this.deleteIssue();
    this.createIssueRoute();
    this.updateIssueRoute();
    this.userIssueListRoute();
    this.teamIssueListRoute();
    this.getAllIssues();
  }

  private getIssue = () => {
    this.router.get("/issue", authenticateUser, this.issueController.getIssue);
  };
  private getAllIssues = () => {
    this.router.get(
      "/issue/all",
      authenticateUser,
      this.issueController.getAllIssue,
    );
  };
  private createIssueRoute = () => {
    this.router.post(
      "/issue/create",
      authenticateUser,
      this.issueController.createNewIssue,
    );
  };
  private updateIssueRoute = () => {
    this.router.put(
      "/issue/update",
      authorise,
      this.issueController.updateIssue,
    );
  };
  private userIssueListRoute = () => {
    this.router.get("/issue/user", this.issueController.getUserIssueList);
  };
  private teamIssueListRoute = () => {
    this.router.get("/issue/team", this.issueController.getTeamIssueList);
  };
  private deleteIssue = () => {
    this.router.delete("/issue", this.issueController.deleteIssue);
  };

  public publishIssueRouter() {
    return this.router;
  }
}
