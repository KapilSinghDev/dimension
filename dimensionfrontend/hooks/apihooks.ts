"use client";
import { apiclient } from "@/api/apiClient";
import { authApi } from "@/api/authApi";
import { issueApi } from "@/api/issueApi";
import { projectApi } from "@/api/projectsApi";
import { s3Api } from "@/api/s3Api";
import { teamApi } from "@/api/teamApi";
import { ProjectApiItem, ProjectBatchResponse } from "@/lib/response.types";
import {
  userCredentials_type,
  userLogin_type,
  userSignup_type,
  userUpdateProfile_type,
} from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";

const projectApiClient = new projectApi();
const issueApiClient = new issueApi();
const s3ApiClient = new s3Api();
const authApiClient = new authApi();
const teamApiClient = new teamApi();
export const useGetUser = (email: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", email],
    queryFn: () => authApiClient.userDetail(email),
    retry: 1,
  });
  return { data, isLoading, error };
};
export const useVerifyUser = (enabled: boolean) => {
  console.log("useVerifyUser hook called");
  const { data, isLoading, error } = useQuery({
    queryKey: ["session-verify"],
    queryFn: () => {
      console.log("Fetching verifyUser", new Error().stack);
      return authApiClient.verifyUser();
    },
    enabled: enabled,
    // staleTime: 0,
    // gcTime: 0,
    // refetchOnMount: "always",
    retry: false,
  });
  return { data, isLoading, error };
};
export const useUserSignup = () => {
  return useMutation({
    mutationFn: (payload: userSignup_type) => authApiClient.userSignup(payload),
    retry: false,
  });
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: (payload: userLogin_type) => authApiClient.userLogin(payload),
    retry: false,
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: (payload: userUpdateProfile_type) =>
      authApiClient.updateUser(payload),
  });
};

export const useGetProjects = (projectId: string) => {
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<ProjectApiItem>({
    queryKey: ["projects", projectId],
    queryFn: () =>
      projectApiClient.getProjects(projectId).then((res) => res.data.message),
    retry: 1,
  });
  return { projects, isLoading, error };
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
  return { projects: response?.projects, isLoading, error };
};

export const useGetIssues = (page: string) => {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["issues-batch", page],
    queryFn: () =>
      issueApiClient.getAllIssues().then((response) => response.data),
    retry: false,
  });
  return { data: response?.message, isLoading, error };
};

export const useGetSingleIssue = (issueId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["issue", issueId],
    queryFn: () =>
      issueApiClient.getIssue({ issueId }).then((res) => res.data.message),
    retry: false,
  });
  return { data, isLoading, error };
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
