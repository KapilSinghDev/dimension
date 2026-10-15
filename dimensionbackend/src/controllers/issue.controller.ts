import authenticationService from "@/service/authentication.service";
import { issueService } from "../service/issues.service";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { userPayloadInterface } from "@/middleware/authenticate";
export class issueController {
  issueService = new issueService();
  authService = new authenticationService();
  createNewIssue = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const decodeToken = jwt.decode(token) as userPayloadInterface;
      req.body.created_by = decodeToken.user_id;
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
    console.log("issue update request received");
    try {
      console.log("issue request completed");
      const { issue_id, issue } = req.body;
      const issueUpdate = await this.issueService.updateIssue(
        Number(issue_id),
        issue,
      );
      return res.status(200).json({ message: issueUpdate });
    } catch (err) {
      if (!res.headersSent) {
        return res.status(500).json({ message: "An error occurred" });
      }
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
    console.log("recieved get all issue");
    const token = req.headers.authorization.split(" ")[1];
    const decodeToken = jwt.decode(token) as userPayloadInterface;
    console.log("User is => ", decodeToken.user_id);
    try {
      const issueList = await this.issueService.getAllIssues(
        decodeToken.user_id,
      );
      res.status(200).send(issueList);
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

  commentIssue = async (req: Request, res: Response) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodeToken = jwt.decode(token) as userPayloadInterface;
    console.log("checking body", req.body);
    try {
      const updateComment = await this.issueService.commentIssue(
        decodeToken.user_id,
        req.body.comment,
        req.body.issueId,
        req.body?.asset_url,
      );
      return res.status(200).json({ comment: updateComment });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "An error occured" });
    }
  };
}
