"use client";
import { apiclient } from "@/api/apiClient";
import { authApi } from "@/api/authApi";
import { issueApi } from "@/api/issueApi";
import { OrganisationApi } from "@/api/organisationApi";
import { projectApi } from "@/api/projectsApi";
import { resourceApi } from "@/api/resourceApi";
import { s3Api } from "@/api/s3Api";
import { teamApi } from "@/api/teamApi";
import {
  IssueItems,
  ProjectApiItem,
  ProjectBatchResponse,
  ProjectOverviewResponse,
} from "@/lib/response.types";
import {
  createNeIssue_type,
  issueActivityType,
  issueCreate_type,
  project_type,
  UpdateResourcePayload,
  userCredentials_type,
  userLogin_type,
  userSignup_type,
  userUpdateProfile_type,
} from "@/lib/types";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

const projectApiClient = new projectApi();
const issueApiClient = new issueApi();
const s3ApiClient = new s3Api();
const authApiClient = new authApi();
const teamApiClient = new teamApi();
const orgApiClient = new OrganisationApi();
const resourceApiClient = new resourceApi();
export const useGetUser = (email: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", email],
    queryFn: () => authApiClient.userDetail(email),
    retry: 1,
  });
  return { data, isLoading, error };
};
export const useVerifyUser = (enabled: boolean) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["session-verify"],
    queryFn: () => {
      return authApiClient.verifyUser();
    },
    enabled: enabled,
    retry: false,
  });
  return { data, isLoading, error };
};
export const useUserSignup = () => {
  return useMutation({
    mutationFn: (payload: userSignup_type) => authApiClient.userSignup(payload),
    retry: false,
    onSuccess: () => {
      toast.success("User signup successfull");
    },
    onError: () => {
      toast.success("Error occured ! Try again");
    },
  });
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: (payload: userLogin_type) => authApiClient.userLogin(payload),
    retry: false,
    onSuccess: () => {
      toast.success("User successfully verified");
    },
    onError: () => {
      toast.success("Error occured ! Try again");
    },
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: (payload: userUpdateProfile_type) =>
      authApiClient.updateUser(payload),
  });
};
// project hooks
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: project_type) =>
      projectApiClient.createProject(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project Updated Successfully");
    },
  });
};

export const useUpdateProject = (project_id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: project_type) =>
      projectApiClient.updateProject({
        projectId: project_id,
        project: payload,
      }),

    onMutate: async (payload) => {
      // 1. Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["project", project_id] });

      // 2. Snapshot the previous value for rollback
      const previousProject = queryClient.getQueryData(["project", project_id]);

      // 3. Optimistically update the cache
      const optimisticProject = { id: project_id, ...payload };
      queryClient.setQueryData(["project", project_id], optimisticProject);

      // 4. Return the snapshot wrapped in an object to pass it to onError
      return { previousProject };
    },

    onError: (err, payload, context) => {
      // 5. Rollback using the context snapshot (3rd argument)
      if (context?.previousProject) {
        queryClient.setQueryData(
          ["project", project_id],
          context.previousProject,
        );
      }
    },

    onSettled: () => {
      // 6. Always refetch/invalidate after error or success to sync with server state
      queryClient.invalidateQueries({ queryKey: ["project", project_id] });
    },
  });
};
export const useGetProjects = (projectId: string) => {
  const [projectsId] = useQueryState("project");
  const { data, isLoading, error } = useQuery<ProjectApiItem>({
    queryKey: ["project", projectId],
    queryFn: () =>
      projectApiClient.getProjects(projectId).then((res) => res.data.message),
    retry: 1,
    enabled: projectId !== "new",
  });
  return { data, isLoading, error };
};

export const useGetProjectsbyBatch = (page: string) => {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery<ProjectBatchResponse>({
    queryKey: ["projects-batch", page],
    queryFn: () =>
      projectApiClient.getProjectsbyBatch(page).then((res) => res.data),
    retry: false,
  });
  const projectTitleList: string[] = [];
  response?.projects.forEach((item) => projectTitleList.push(item.title));
  return { projects: response?.projects, isLoading, error, projectTitleList };
};

export const useGetProjectOverview = (projectId: string, enabled: boolean) => {
  interface responseType {
    message: ProjectOverviewResponse;
  }
  const {
    data: messgae,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project-overview" + projectId],
    queryFn: () => projectApiClient.getProjectOverview(projectId),
    enabled: enabled,
    retry: false,
  });
  return { data: messgae, isLoading, error };
};

export const useUploadToS3 = () => {
  return useMutation({
    mutationFn: ({ url, file }: { url: string; file: File }) =>
      s3ApiClient.redirectUpload(url, file, file.type),
  });
};

export const useUploadImage = () => {
  const uploadToS3 = useUploadToS3();
  return useMutation({
    mutationFn: async (file: File) => {
      const res = await s3ApiClient.uploadMedia(file.name, file.type);
      const { url, fileKey } = res.data as { url: string; fileKey: string };

      await uploadToS3.mutateAsync({ url, file });

      return fileKey;
    },
  });
};
// team hooks
export const useGetTeamPerUser = (teamId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-team", teamId],
    queryFn: () => teamApiClient.getTeam(teamId),
  });
  return { data, isLoading, error };
};

// issue hooks

export const useGetSingleIssue = (issueId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["issue", issueId],
    queryFn: () =>
      issueApiClient.getIssue({ issueId }).then((res) => res.data.message),
    retry: false,
  });
  return {
    data,
    isLoading,
    error,
  };
};
export const useCreateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (issue: createNeIssue_type) =>
      issueApiClient.createIssue(issue),

    onMutate: async (newIssue) => {
      await queryClient.cancelQueries({ queryKey: ["issues-batch"] });
      if (newIssue?.project && newIssue.project !== -1) {
        await queryClient.cancelQueries({
          queryKey: ["project", newIssue.project],
        });
      }

      const randomId = Math.floor(Math.random() * 1000000);
      const optimisticIssue = { ...newIssue, issue_id: randomId };

      // 2. Snapshot previous values for rollback capability
      const previousIssues = queryClient.getQueryData(["issues-batch"]);
      const previousProject =
        newIssue?.project && newIssue.project !== -1
          ? queryClient.getQueryData(["project", newIssue?.project.toString()])
          : null;
      // 3. Optimistically update global issues cache
      queryClient.setQueryData<createNeIssue_type[]>(
        ["issues-batch"],
        (old = []) => [optimisticIssue, ...old],
      );

      // update the Project-specific cache response object
      if (newIssue?.project && newIssue.project !== -1) {
        queryClient.setQueryData<ProjectApiItem>(
          ["project", newIssue.project.toString()],
          (oldProject: any) => {
            if (!oldProject) return oldProject;
            //  project response object contains an array of issues
            return {
              ...oldProject,
              issues: [optimisticIssue, ...(oldProject.issues || [])],
            };
          },
        );
      }

      return { previousIssues, previousProject, projectId: newIssue?.project };
    },

    onError: (err, newIssue, context) => {
      // Roll back both caches if the mutation fails
      if (context?.previousIssues) {
        queryClient.setQueryData(["issues-batch"], context.previousIssues);
      }
      if (
        context?.projectId &&
        context.projectId !== -1 &&
        context?.previousProject
      ) {
        queryClient.setQueryData(
          ["project", context.projectId],
          context.previousProject,
        );
      }
      toast.error("Failed to create issue. Please try again.");
    },

    onSettled: (data, error, newIssue) => {
      queryClient.invalidateQueries({ queryKey: ["issues-batch"] });
      if (newIssue?.project && newIssue.project !== -1) {
        queryClient.invalidateQueries({
          queryKey: ["project", newIssue.project.toString()],
        });
      }
    },

    onSuccess: () => {
      toast.success("Issue created successfully.");
    },
  });
};
export const useGetIssues = () => {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["issues-batch"],
    queryFn: () =>
      issueApiClient.getAllIssues().then((response) => response.data),
    retry: false,
  });
  return { data: response, isLoading, error };
};

const ISSUES_KEY = ["issues-batch"];
export const useUpdateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      issue_id: string;
      updateIssuePayload: issueCreate_type;
    }) =>
      issueApiClient.updateIssue({
        issue_id: payload.issue_id,
        issue: payload.updateIssuePayload,
      }),

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ISSUES_KEY });
      const previous = queryClient.getQueryData<IssueItems[]>(ISSUES_KEY);
      queryClient.setQueryData<IssueItems[]>(ISSUES_KEY, (old = []) =>
        old.map((issue) =>
          String(issue.issue_id) === String(payload.issue_id)
            ? { ...issue, ...payload.updateIssuePayload }
            : issue,
        ),
      );

      return { previous };
    },

    onError: (err, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData(ISSUES_KEY, context.previous);

      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? err.message)
        : "Something went wrong";

      toast.error(message);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ISSUES_KEY });
    },
  });
};

export const useUpdateIssueActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: issueActivityType) =>
      issueApiClient.activityIssue(payload),

    onMutate: async (payload) => {
      const queryKey = ["issue", payload.issueId];

      await queryClient.cancelQueries({ queryKey });
      const prevIssue = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          activities: [...(old.activities || []), payload],
        };
      });

      return { prevIssue };
    },

    onError: (_err, vars, context) => {
      if (context?.prevIssue) {
        queryClient.setQueryData(["issue", vars.issueId], context.prevIssue);
      }
      toast.error("Failure updating activity");
    },

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ["issue", vars.issueId] });
    },

    onSuccess: () => {
      toast.success("Activity updated");
    },
  });
};

export const useGetIssueActivity = () => {
  return useQuery({
    queryKey: ["issue-activity"],
    queryFn: () => {},
  });
};
//organisation hooks

export const useGetAllOrganisations = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["organisations"],
    queryFn: () => orgApiClient.getAllOrganisations(),
    retry: false,
  });
  return { data, isLoading, error };
};

// resources hooks
export const useCreateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload }: { payload: UpdateResourcePayload }) =>
      resourceApiClient.createResource(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast.success("Document updated successfully");
    },
    onError: () => {
      toast.error("Error while updating document");
    },
  });
};

export const useGetResourceById = (id: string, enabled: boolean) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["resource", id],
    queryFn: () => resourceApiClient.getResource(id), // 👈 Implicit return fixes the issue
    enabled: enabled,
  });

  return { data, isLoading, isError };
};

export const useGetResourceByBatch = (page: string) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["resources-batch", page],
    queryFn: () => resourceApiClient.getResourceBatch(page),
    retry: false,
  });
  return { data, isLoading, isError };
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      resourceId,
      payload,
    }: {
      resourceId: string;
      payload: UpdateResourcePayload;
    }) => resourceApiClient.updateResource(resourceId, payload),
    // onMutate: async () => {
    // },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["resource", data.data.resource_id],
      });
      toast.success("Document Updated");
    },
    onError: () => {
      toast.error("Failure updating document");
    },
  });
};
