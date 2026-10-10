import { issue_type, issueCreate_type } from "@/lib/types";
import { apiclient } from "./apiClient";

export class issueApi {
  getIssue(payload: { issueId: string }) {
    return apiclient.get("/issue", {
      params: payload,
    });
  }

  getAllIssues(page: string) {
    const token = localStorage.getItem("TOKEN");
    return apiclient.get("/issue/all", {
      headers: { Authorization: `Bearer ${token}` },
      params: { page: page },
    });
  }

  createIssue(payload: issueCreate_type) {
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
}
