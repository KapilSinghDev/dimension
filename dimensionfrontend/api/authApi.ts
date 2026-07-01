import {
  userCredentials_type,
  userLogin_type,
  userUpdateProfile_type,
} from "@/lib/types";
import { apiclient } from "./apiClient";

export class authApi {
  userSignup(payload: userCredentials_type) {
    return apiclient.post("/signup", payload);
  }

  userLogin(payload: userLogin_type) {
    return apiclient.post("/login", payload);
  }

  userDetail(payload: string) {
    return apiclient.get("/user", {
      params: { email: payload },
    });
  }

  updateUser(payload: userUpdateProfile_type) {
    return apiclient.put("/update", payload);
  }
}
