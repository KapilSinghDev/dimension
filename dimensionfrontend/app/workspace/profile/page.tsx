"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  Building2,
  Users2,
  Mail,
  Calendar,
  KeyRound,
  Pencil,
  LogOut,
  Trash2,
  Camera,
} from "lucide-react";
import {
  useGetTeamPerUser,
  useGetUser,
  useUpdateUser,
  useUploadImage,
} from "@/hooks/apihooks";
import { useQueryClient } from "@tanstack/react-query";

// Initial Mock State
const initialUserData = {
  firstname: "Kapil Singh",
  email: "kapil@dimension.io",
  picture:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  role: "Lead Software Engineer",
  organisation: "Dimension HQ",
  teams: {
    team_id: 2,
    name: "Frontend Engineering",
  },
  created_at: "Joined July 2025",
};
interface Team {
  team_id: number;
  name: string;
}

interface UserProfile {
  firstname: string;
  lastname: string;
  email: string;
  picture: string;
  role: string;
  organisation: string;
  teams: Team;
  created_at: string;
}
export default function EnhancedVerticalProfilePage() {
  const { data, isLoading, error } = useGetUser("aanya.mehta@example.com");
  const [user, setUser] = useState<UserProfile>(data?.data);
  console.log(user.role);
  // Temporary Form States for Modals
  const [newRole, setNewRole] = useState<string>(user.role);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [orgLeaveOpen, setOrgLeaveOpen] = useState(false);
  const [teamLeaveOpen, setTeamLeaveOpen] = useState(false);
  const [selectedTeamToLeave, setSelectedTeamToLeave] = useState("");

  const initials =
    user.firstname + user.lastname.split(" ").join("").toUpperCase();

  // Handlers
  const handleUpdateRole = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUser((prev) => ({ ...prev, role: newRole }));
    setRoleModalOpen(false);
  };

  const handleLeaveOrganisation = () => {
    setUser((prev) => ({ ...prev, organisation: "None (Independent)" }));
    setOrgLeaveOpen(false);
  };

  const handleLeaveTeam = () => {
    // setUser((prev) => ({
    //   ...prev,
    //   teams: prev.teams.filter((t) => t !== selectedTeamToLeave),
    // }));
    setTeamLeaveOpen(false);
  };
  const imageInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = useUploadImage();
  const updateUser = useUpdateUser();
  const queryClient = useQueryClient();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadImage.mutate(file, {
      onSuccess: (fileKey: string) => {
        updateUser.mutate(
          {
            user_email: user.email,
            url: fileKey,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["user"] });
            },
          },
        );
      },
    });
  };
  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 space-y-4">
      <div className="flex flex-col items-center text-center pt-4 pb-2 space-y-4">
        <div className="relative group w-28 h-28">
          <Avatar className="w-28 h-28 border-4 border-background shadow-md">
            <AvatarImage
              src={user.picture}
              alt={user.firstname}
              className="object-cover"
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          {/* Hover overlay */}
          <label
            htmlFor="avatar-upload"
            className="absolute inset-0 rounded-full flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          >
            <Camera size={20} className="text-white" />
            <span className="text-[10px] font-medium text-white leading-none">
              Change photo
            </span>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            ref={imageInputRef}
            onChange={handleImageUpload}
          />

          <span className="absolute bottom-1 right-2 w-4 h-4 bg-emerald-500 border-2 border-background rounded-full" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            {user.firstname}
          </h1>
          <p className="text-sm text-muted-foreground">{user.role}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Mail size={13} />
            <span>{user.email}</span>
          </div>
          <span className="text-muted-foreground/40">•</span>
          <div className="flex items-center gap-1">
            <Calendar size={13} />
            <span>{user.created_at}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* 2. ACTIONS AND DATA INTERACTIVE LAYERS */}
      <div className="space-y-2">
        {/* Organisation Management Card */}
        <Card className="shadow-sm border-border/60 overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground block">
                Organisation
              </span>
              <span className="text-sm font-medium text-foreground">
                {user.organisation}
              </span>
            </div>

            <Dialog open={orgLeaveOpen} onOpenChange={setOrgLeaveOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                >
                  <LogOut size={14} />
                  <span>Leave</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle className="text-destructive flex items-center gap-2">
                    <LogOut size={18} /> Leave Organisation?
                  </DialogTitle>
                  <DialogDescription className="pt-2 text-sm">
                    Are you sure you want to exit **{user.organisation}**? You
                    will instantly lose read and write clearances across all
                    nested source repositories.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOrgLeaveOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLeaveOrganisation}
                  >
                    Confirm Exit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* System Role Clearance Card */}
        <Card className="shadow-sm border-border/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground block">
                System Role Clearance
              </span>
              <Badge
                variant="secondary"
                className="gap-1 font-medium text-xs py-0.5"
              >
                <ShieldCheck size={12} className="text-primary" />
                {user?.role}
              </Badge>
            </div>

            <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                >
                  <Pencil size={12} />
                  <span>Edit</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleUpdateRole}>
                  <DialogHeader>
                    <DialogTitle>Update Profile Position</DialogTitle>
                    <DialogDescription>
                      Modify your directory title. This changes your global
                      visibility flags on active timelines.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-xs">
                        Functional Title
                      </Label>
                      <Input
                        id="role"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="h-9 text-sm"
                        placeholder="e.g. Lead Dev"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setRoleModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="sm">
                      Save Changes
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Assigned Teams Card */}
        <Card className="shadow-sm border-border/60">
          <CardHeader className="p-4 pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground block">
                Assigned Teams
              </CardTitle>
              <CardDescription className="text-xs">
                Active working groups inside your current layout directory
                context.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            {user.teams?.name.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-2">
                No active assigned teams.
              </p>
            ) : (
              <div className="flex flex-col gap-2 mt-1">
                {/* {user.teams.map((team, idx) => (
                  
                ))} */}
                <div
                  // key={idx}
                  className="flex items-center justify-between p-2 border border-border/50 bg-muted/20 hover:bg-muted/40 rounded-lg transition-colors text-sm font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Users2 size={14} className="text-muted-foreground" />
                    <span>{user.teams.name}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={() => {
                      // setSelectedTeamToLeave(team);
                      setTeamLeaveOpen(true);
                    }}
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reusable Team Leave Modal Target Anchor */}
      <Dialog open={teamLeaveOpen} onOpenChange={setTeamLeaveOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              Leave Team Matrix
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm">
              Confirm removal from **{selectedTeamToLeave}**. You will stop
              receiving scope assignments and task distributions for this
              sub-block.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTeamLeaveOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLeaveTeam}>
              Leave Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
