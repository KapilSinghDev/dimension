import {
  createNeIssue_type,
  issue_type,
  issueActivityType,
  issueCreate_type,
} from "@/lib/types";
import { apiclient } from "./apiClient";
// import { headers } from "next/headers";

export class issueApi {
  getIssue(payload: { issueId: string }) {
    return apiclient.get("/issue", {
      params: payload,
    });
  }

  getAllIssues() {
    const token = localStorage.getItem("TOKEN");
    return apiclient.get("/issue/all", {
      headers: { Authorization: `Bearer ${token}` },
      // params: { page: page },
    });
  }

  createIssue(payload: createNeIssue_type) {
    return apiclient.post("/issue/create", payload);
  }

  updateIssue(payload: { issue_id: string; issue: issueCreate_type }) {
    const token = localStorage.getItem("TOKEN");
    return apiclient.put(
      "/issue/update", // No ID in URL
      payload, // Send whole payload object (contains issueId and issue)
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }

  getUserIssueList(payload: { userId: string }) {
    const token = localStorage.getItem("TOKEN");
    return apiclient.get("/issue/user", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        payload,
      },
    });
  }

  getTeamIssueList(payload: { teamId: string }) {
    return apiclient.get("/issue/team", {
      params: {
        payload,
      },
    });
  }

  deleteIssue(payload: { issueId: string }) {
    return apiclient.delete("/issue", {
      params: {
        payload,
      },
    });
  }

  activityIssue(payload: issueActivityType) {
    const token = localStorage.getItem("TOKEN");
    const formData = new FormData();
    formData.append("comment", payload.comment);
    formData.append("issueId", payload.issueId);
    if (payload.media) {
      formData.append("media", payload.media);
    }

    return apiclient.post("/issue/comment", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getIssueActivity() {
    const token = localStorage.getItem("TOKEN");
    apiclient.get("/issue/comment", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
