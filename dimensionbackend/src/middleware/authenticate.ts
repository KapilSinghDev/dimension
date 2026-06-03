import * as express from "express";
import { Request, Response } from "express";
import authenticationService from "../service/authentication.service";
import * as jwt from "jsonwebtoken";

async function authenticateUser(req: Request, res: Response, next) {
  const auth = new authenticationService();
  const token = req.headers.authorization.split(" ")[1];
  const decodeToken = jwt.verify(token, auth.SECRET_KEY);
  const userVerification = await auth.searchUser(decodeToken.user_email);
  if (userVerification === null) {
    res.status(401).send({ message: "Unauthorised" });
    return;
  }
  next();
}

export { authenticateUser };
