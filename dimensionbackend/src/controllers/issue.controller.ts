import { issueService } from "../service/issues.service";
import { Request, Response } from "express";

export class issueController {
  issueService = new issueService();

  createNewIssue = async (req: Request, res: Response) => {
    try {
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
      res.send({ message: issueList }).send(200);
    } catch (err) {
      console.error(err);
      res.send({ message: "An error occured" }).status(500);
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
