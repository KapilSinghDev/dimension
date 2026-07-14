import { MIMEType } from "node:util";
import { apiclient } from "./apiClient";

export class s3Api {
  //goes to backend
  uploadMedia = (fileName: string, contentType: string) => {
    return apiclient.post("/media-upload", { fileName, contentType });
  };

  //goes directly to s3
  redirectUpload = (redirecturl: string, file: File, contentType: string) => {
    return apiclient.put(redirecturl, file, {
      headers: { "Content-Type": contentType },
    });
  };
}
