import { S3Client } from "@aws-sdk/client-s3";
export class s3ServiceClient {
  s3Cleint = new S3Client({
    region: "",
  });

  uploadObject = async () => {};
}
