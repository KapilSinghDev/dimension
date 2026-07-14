import * as express from "express";
import { authenticateUser } from "../middleware/authenticate";
import { Router, Request, Response } from "express";
import { authenticationController } from "../controllers/authentication.controller";
import * as multer from "multer";
export class authRoutes {
  private authRouter: Router;
  authController = new authenticationController();
  constructor() {
    this.authRouter = express.Router();
    this.authRouteRegister();
  }

  private authRouteRegister() {
    (this.loginRoute(),
      this.signupRoute(),
      this.userDetailRoute(),
      this.userUpdateRoute());
  }

  private loginRoute = () => {
    this.authRouter.post("/login", this.authController.userLogin);
  };

  private signupRoute = () => {
    const upload = multer({ storage: multer.memoryStorage() });
    this.authRouter.post(
      "/signup",
      upload.single("image"),
      this.authController.userSignUp,
    );
  };

  private userDetailRoute = () => {
    this.authRouter.get(
      "/user",
      // authenticateUser,
      this.authController.getUserDetails,
    );
  };
  private userUpdateRoute = () => {
    this.authRouter.put(
      "/update",
      authenticateUser,
      this.authController.userProfileUpdate,
    );
  };

  public publishAuthRoutes = () => {
    return this.authRouter;
  };
}
