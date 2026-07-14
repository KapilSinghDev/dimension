import { Router, Express } from "express";
import * as express from "express";
import { s3Controller } from "../controllers/s3.controller";
import multer = require("multer");
export class s3MediaRoutes {
  s3Router: Router;
  s3Controller = new s3Controller();
  constructor() {
    this.s3Router = express.Router();
    this.mediaUploadRoute();
  }

  public mediaUploadRoute = () => {
    this.s3Router.post(
      "/media-upload",
      this.s3Controller.mediaUploadController,
    );
  };

  public publishMediaRoutes = () => {
    return this.s3Router;
  };
}
