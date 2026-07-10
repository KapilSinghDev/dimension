import { Request, Response } from "express";
import authenticationService from "../service/authentication.service";
import { validate } from "../decorators/validator.decorator";
import {
  search_user_dto,
  user_credentials_dto,
  user_login_dto,
} from "../dto/user_dto";
export class authenticationController {
  @validate(user_credentials_dto)
  async userSignUp(req: Request, res: Response) {
    console.log("INSIDE userSignUp, req.body:", req.body);
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
      res
        .send(
          loginResponse === true
            ? { message: "User Verified", token: " " }
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
  @validate(search_user_dto)
  async getUserDetails(req: Request, res: Response) {
    try {
      const authService = new authenticationService();
      const user = await authService.searchUser(req.body.email);
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
}
