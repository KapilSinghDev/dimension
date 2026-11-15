import React from "react";
import { Plus, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";

const Assignissue = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 h-7 w-full justify-start gap-1.5 rounded-md px-2 text-[13px] font-normal text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
          Add a team member
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-0 overflow-hidden rounded-lg border border-blue-200 bg-white p-0 shadow-2xl shadow-blue-900/10 sm:max-w-[640px] sm:rounded-lg">
        {/* Header */}
        <DialogHeader className="space-y-1 px-6 pb-3 pt-5 text-left">
          <DialogTitle className="text-[15px] font-medium tracking-tight text-slate-900">
            Add an email address
          </DialogTitle>
          <DialogDescription className="text-[13px] text-slate-500">
            Send an invite via email to assign this issue.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 pb-5">
          <Textarea
            placeholder="name@company.com"
            rows={4}
            className="min-h-[104px] resize-none rounded-md border-blue-200 bg-blue-50/30 px-3 py-2.5 text-[13px] text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:border-blue-200 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Footer */}
        <DialogFooter className="m-0 flex flex-row items-center justify-end gap-2 border-t border-blue-100 bg-blue-50/30 px-6 py-3 sm:justify-end sm:space-x-0">
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-md px-3 text-[13px] font-normal text-slate-600 hover:bg-blue-100/60 hover:text-slate-900"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            size="sm"
            className="h-8 rounded-md bg-blue-600 px-3.5 text-[13px] font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Send invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Assignissue;
