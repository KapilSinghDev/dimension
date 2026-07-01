import { issue_type, issueCreate_type } from "@/lib/types";
import { apiclient } from "./apiClient";

export class issueApi {
  getIssue(payload: { issueId: string }) {
    // TODO: payload shape — likely issue id or title, sent as query param
    return apiclient.get("/issue", {
      params: {
        payload,
      },
    });
  }

  getAllIssues() {
    return apiclient.get("/issue/all");
  }

  createIssue(payload: issueCreate_type) {
    return apiclient.post("/issue/create", payload);
  }

  updateIssue(payload: { issueId: string; issue: issueCreate_type }) {
    return apiclient.put("/issue/update", payload);
  }

  getUserIssueList(payload: { userId: string }) {
    return apiclient.get("/issue/user", {
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
