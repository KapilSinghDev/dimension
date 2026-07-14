import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  getSignedUrl,
  S3RequestPresigner,
} from "@aws-sdk/s3-request-presigner";
import "dotenv/config";
export class s3ServiceClient {
  s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  bucket_name = process.env.BUCKET_NAME;
  uploadObject = async (filebuffer, originalname, mimetype) => {
    const uniqueKey = `uploads/${Date.now()}-${originalname}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket_name,
      Key: uniqueKey,
      Body: filebuffer,
      ContentType: mimetype,
    });
    const uploadResponse = await this.s3Client.send(command);
    return {
      success: uploadResponse.$metadata.httpStatusCode === 200 ? true : false,
      fileKey: uniqueKey,
      response: uploadResponse,
      url: `https://${this.bucket_name}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`,
    };
  };

  getPreSignedUploadUrl = async (key: string, contentType: string) => {
    const uniqueKey = `uploads/${Date.now()}-${key}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket_name,
      Key: uniqueKey,
      ContentType: contentType,
    });
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    return { url, fileKey: uniqueKey };
  };
}
