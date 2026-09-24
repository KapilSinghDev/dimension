import authenticationService from "@/service/authentication.service";
import { issueService } from "../service/issues.service";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
export class issueController {
  issueService = new issueService();
  authService = new authenticationService();
  createNewIssue = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const decodeToken = jwt.verify(
        token,
        this.authService.SECRET_KEY as string,
      );
      console.log("the decoded token => ", decodeToken);
      req.body.created_by = 1;
      console.log("the body received in creating a new issue is => ", req.body);
      const issue = await this.issueService.createIssue(req.body);
      res.send({ message: "success", "issue id": issue }).status(201);
    } catch (err) {
      console.error(err);
      res.send({ message: "An error occured" }).status(500);
    }
    return;
  };

  deleteIssue = async (req: Request, res: Response) => {
    try {
      const deleteissue = await this.issueService.deleteIssue(req.body.issueId);
      res.send({ message: deleteissue }).status(201);
    } catch (err) {
      console.error(err);
      res.send({ message: "An error occured" }).status(500);
    }
  };

  updateIssue = async (req: Request, res: Response) => {
    try {
      const issueUpdate = await this.issueService.updateIssue(
        req.body.issueId,
        req.body.issue,
      );
      res.send({ message: issueUpdate }).status(201);
    } catch (err) {
      console.error(err);
      res.send({ message: "An error occured" }).status(500);
    }
  };

  getIssue = async (req: Request, res: Response) => {
    try {
      const targetIssue = await this.issueService.findIssue(
        Number(req.query.issueId),
      );
      res.status(201).json({ message: targetIssue });
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "An error occured" });
      return;
    }
  };

  getAllIssue = async (req: Request, res: Response) => {
    try {
      const issueList = await this.issueService.getAllIssues();
      res.status(200).send({ message: issueList });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "An error occured" });
      throw err;
    }
    return;
  };

  getUserIssueList = async (req: Request, res: Response) => {
    try {
      const issues = await this.issueService.findIssuePerUser(req.body.userId);
      res.send({ message: issues }).status(201);
    } catch (err) {
      console.error(err);
      res.send({ message: "An error occured" }).status(500);
      throw err;
    }
  };

  getTeamIssueList = async (req: Request, res: Response) => {
    try {
      const issues = await this.issueService.findIssuePerTeam(req.body.teamId);
      res.send({ message: issues }).status(201);
    } catch (err) {
      console.error(err);
      res.send({ message: "An error occured" }).status(500);
      throw err;
    }
  };
}
