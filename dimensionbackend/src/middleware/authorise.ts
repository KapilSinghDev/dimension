// middleware to check ownership and authorization
import * as express from "express";
import { Request, Response, NextFunction } from "express";
import authenticationService from "../service/authentication.service";
import * as jwt from "jsonwebtoken";
import { issueService } from "../service/issues.service";
import { teamService } from "../service/team.service";
import { UserTokenPayload } from "@/controllers/authentication.controller";

export async function authorise(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const auth = new authenticationService();
  const issue = new issueService();
  const teamServices = new teamService();
  const token = req.headers.authorization.split(" ")[1];
  const decodeToken = jwt.verify(token, auth.SECRET_KEY) as UserTokenPayload;
  const user = await auth.searchUser(decodeToken.user_email);
  console.log("the middle ware user is =>", user);
  if (req.body.taget === "teams") {
    const targetTeam = await teamServices.findTeam(req.body.team_id);
    if (user.user_id === targetTeam.admin.user_id) {
      return next();
    }
    return res.status(404).send({ message: "Un Authorised " });
  }
  // Fixed by Copilot: allow the issue ID field used by the update request.
  const target = await issue.findIssue(req.body.issue_id ?? req.body.issueId);
  if (target && user.user_id === target.created_by) {
    console.log("user verified and moved forward");
    return next();
  }
  return res.status(404).send({ message: "Un Authorised " });
}
