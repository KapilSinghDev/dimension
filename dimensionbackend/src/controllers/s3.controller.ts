import { Request, Response } from "express";
import { s3ServiceClient } from "../service/s3.service";

export class s3Controller {
  s3Service = new s3ServiceClient();

  mediaUploadController = async (req: Request, res: Response) => {
    try {
      const { fileName, contentType } = req.body;

      if (!fileName || !contentType) {
        res
          .status(400)
          .send({ error: "fileName and contentType are required" });
        return;
      }

      const response = await this.s3Service.getPreSignedUploadUrl(
        fileName,
        contentType,
      );
      res.status(200).send(response);
    } catch (err) {
      res.status(500).send({ error: "Failed to generate upload URL" });
    }
  };
}
