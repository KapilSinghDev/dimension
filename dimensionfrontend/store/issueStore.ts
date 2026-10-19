import { create } from "zustand";

interface Issue {
  id: number;
  title: string;
}

// 1. Create the store
const useIssueStore = create<{
  issueList: Issue[];
  setIssueList: (issues: Issue[]) => void;
}>((set) => ({
  issueList: [],
  setIssueList: (issues) => set({ issueList: issues }),
}));

// 2. Export your custom hooks/functions
export const useIssueList = () => useIssueStore((state) => state.issueList);

export const setIssueList = (issues: Issue[]) => {
  useIssueStore.getState().setIssueList(issues);
};
