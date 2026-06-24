// middleware to check ownership and authorization
import * as express from "express";
import { Request, Response, NextFunction } from "express";
import authenticationService from "../service/authentication.service";
import * as jwt from "jsonwebtoken";
import { issueService } from "../service/issues.service";
import { teamService } from "../service/team.service";

export async function authorise(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const auth = new authenticationService();
  const issue = new issueService();
  const teamServices = new teamService();
  const token = req.headers.authorization.split(" ")[1];
  const email = jwt.verify(token, auth.SECRET_KEY);
  const user = await auth.searchUser(email);
  if (req.body.taget === "teams") {
    const targetTeam = await teamServices.findTeam(req.body.team_id);
    if (user === targetTeam.admin) {
      next();
    }
    res.status(404).send({ message: "Un Authorised " });
    return;
  }
  const target = await issue.findIssue(req.body.issue_id);
  if (user.user_id === target.created_by) {
    next();
  }
  res.status(404).send({ message: "Un Authorised " });
  return;
}
