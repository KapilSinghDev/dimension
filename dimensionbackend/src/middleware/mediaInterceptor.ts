import { Request, Response, NextFunction } from "express";
import { s3ServiceClient } from "../service/s3.service";

const s3Service = new s3ServiceClient();

export async function mediaInterceptor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    console.log("media interceptor on the go", req.body);
    if (req.file) {
      const uploaded = await s3Service.uploadObject(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
      );
      console.log("media intercepted", uploaded.url);
      req.body.asset_url = uploaded.url; // final S3 URL
    }
    next();
  } catch (err) {
    next(err);
  }
}
