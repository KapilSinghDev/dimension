import { Request, Response } from "express";
import authenticationService from "../service/authentication.service";
import { validate } from "../decorators/validator.decorator";
import {
  search_user_dto,
  user_credentials_dto,
  user_login_dto,
} from "../dto/user_dto";
import * as jwt from "jsonwebtoken";
export class authenticationController {
  @validate(user_credentials_dto)
  async userSignUp(req: Request, res: Response) {
    try {
      const authService = new authenticationService();
      console.log("request body => ", req.body);
      const signupResponse = await authService.createAndSaveUser(
        req.body,
        req.file,
      );
      res.status(201).send(signupResponse);
      return;
    } catch (err) {
      console.error("caught an error", err);
      res.status(500).send({
        message: "An error occurred",
      });
    }
  }
  @validate(user_login_dto)
  async userLogin(req: Request, res: Response) {
    try {
      const authService = new authenticationService();
      const loginResponse = await authService.verifyUser(req.body);
      let token;
      if (loginResponse === true) {
        token = await authService.generateToken(req.body.email);
      }
      res
        .send(
          loginResponse === true
            ? { message: "User Verified", token: token }
            : { message: "Invalid user" },
        )
        .status(201);
      return;
    } catch (err) {
      console.error(err);
      res
        .send({
          message: "An error Occured",
        })
        .status(500);
      throw err;
    }
  }
  // @validate(search_user_dto)
  async getUserDetails(req: Request, res: Response) {
    try {
      const authService = new authenticationService();
      const user = await authService.searchUser(req.query.email as string);
      res.send(user).status(201);
      return;
    } catch (err) {
      console.error(err);
      res.send("An error occured").status(500);
      throw err;
    }
  }

  async userProfileUpdate(req: Request, res: Response) {
    try {
      const authService = new authenticationService();
      const user = await authService.updateUserProfile(
        req.body.email,
        req.body.role,
        req.body.organisation,
        req.body.url,
      );
      res
        .send({ message: "User updated successfully", user: user })
        .status(200);
    } catch (err) {
      console.error(err);
      res.send({ message: "An error occured" }).status(500);
    }
    return;
  }

  async userVerification(req: Request, res: Response) {
    interface UserTokenPayload {
      user_email: string;
      iat: number;
      exp: number;
    }
    try {
      const authService = new authenticationService();
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).send({ message: "No token provided" });
        return;
      }
      const decodeToken = jwt.verify(
        token,
        authService.SECRET_KEY as string,
      ) as UserTokenPayload;

      const user = await authService.searchUser(decodeToken.user_email);

      if (!user) {
        res.status(401).send({ message: "Unauthorised" });
        return;
      }
      res.set("Cache-Control", "no-store");
      res.status(200).send({ message: "Session active", user });
    } catch (err) {
      res.status(401).send({ message: "Invalid or expired session" });
    }
  }
}
