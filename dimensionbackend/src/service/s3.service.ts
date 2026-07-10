import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";
export class s3ServiceClient {
  s3Client = new S3Client({
    region: process.env.ACCESS_KEYS,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  uploadObject = async (filebuffer, originalname, mimetype) => {
    const bucket_name = process.env.BUCKET_NAME;
    const uniqueKey = `uploads/${Date.now()}-${originalname}`;
    const command = new PutObjectCommand({
      Bucket: bucket_name,
      Key: uniqueKey,
      Body: filebuffer,
      ContentType: mimetype,
    });
    const uploadResponse = await this.s3Client.send(command);
    return {
      success: true,
      fileKey: uniqueKey,
      response: uploadResponse,
    };
  };
}
