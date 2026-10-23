"use client";

import { useCallback } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeftRight,
  ChevronDown,
  CircleUser,
  Eye,
  Inbox,
  LayoutGrid,
  LogOut,
  MoreHorizontal,
  Pen,
  Search,
  Settings,
  Star,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  issue_route,
  project_route,
  user_profile_route,
  welcome_route,
} from "@/lib/routes";

/* --------------------------------- config ---------------------------------- */
// Static data lives outside the component so it isn't rebuilt on every render.

type NavItem = {
  label: string;
  icon: LucideIcon;
  href?: string; // items without an href render as inert buttons for now
  badge?: number;
};

type Team = {
  id: string;
  name: string;
  color: string; // tailwind bg class for the avatar tile
  items: NavItem[];
};

const TOP_NAV: NavItem[] = [
  { label: "Inbox", icon: Inbox, badge: 4 },
  { label: "My issues", icon: CircleUser },
  { label: "My profile", icon: UserRound, href: user_profile_route },
];

const TEAMS: Team[] = [
  {
    id: "my-team",
    name: "My Team",
    color: "bg-emerald-500",
    items: [
      { label: "Issues", icon: AlertCircle, href: issue_route },
      { label: "Projects", icon: LayoutGrid, href: `${project_route}?page=1` },
      { label: "Views", icon: Eye },
    ],
  },
];

const WORKSPACE_NAV: NavItem[] = [
  { label: "Projects", icon: LayoutGrid },
  { label: "Views", icon: Eye },
  { label: "More", icon: MoreHorizontal },
];

const WORKSPACE_MENU = [
  { label: "Settings", icon: Settings },
  { label: "Invite members", icon: UserPlus },
  { label: "Manage members", icon: Users },
  { label: "Switch workspace", icon: ArrowLeftRight },
];

const getInitials = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/* ------------------------------ small pieces ------------------------------- */

function NavRow({ item, active }: { item: NavItem; active: boolean }) {
  const inner = (
    <>
      <item.icon />
      <span>{item.label}</span>
    </>
  );

  return (
    <SidebarMenuItem>
      {item.href ? (
        <SidebarMenuButton asChild isActive={active}>
          <Link href={item.href}>{inner}</Link>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton>{inner}</SidebarMenuButton>
      )}
      {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
    </SidebarMenuItem>
  );
}

function Section({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <Collapsible defaultOpen className="group/section">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="w-full cursor-pointer text-xs font-medium transition-colors hover:text-sidebar-foreground">
            <span className="flex items-center gap-1.5">
              {Icon && <Icon />}
              {label}
            </span>
            <ChevronDown className="ml-auto -rotate-90 transition-transform duration-200 group-data-[state=open]/section:rotate-0" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>

        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>{children}</SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

function TeamNav({
  team,
  isActive,
}: {
  team: Team;
  isActive: (href?: string) => boolean;
}) {
  return (
    <Collapsible asChild defaultOpen className="group/team">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="font-medium">
            <span
              className={`grid size-5 shrink-0 place-items-center rounded-md text-[9px] font-bold text-white ${team.color}`}
            >
              {getInitials(team.name)}
            </span>
            <span>{team.name}</span>
            <ChevronDown className="ml-auto -rotate-90 transition-transform duration-200 group-data-[state=open]/team:rotate-0" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {team.items.map((item) => (
              <SidebarMenuSubItem key={item.label}>
                {item.href ? (
                  <SidebarMenuSubButton
                    className="w-full"
                    asChild
                    isActive={isActive(item.href)}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuSubButton>
                ) : (
                  <SidebarMenuSubButton asChild>
                    <button type="button">
                      <item.icon />
                      <span>{item.label}</span>
                    </button>
                  </SidebarMenuSubButton>
                )}
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

/* -------------------------------- component -------------------------------- */

type AppSidebarProps = {
  workspaceName?: string;
  onSearch?: () => void;
  onNewIssue?: () => void;
};

export function AppSidebar({
  workspaceName = "Acme Corp",
  onSearch,
  onNewIssue,
}: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // "/workspace/projects?page=1" is active on /workspace/projects and below it
  const isActive = useCallback(
    (href?: string) => {
      if (!href) return false;
      const base = href.split("?")[0];
      return pathname === base || pathname.startsWith(`${base}/`);
    },
    [pathname],
  );

  const handleLogout = useCallback(() => {
    Cookies.remove("TOKEN");
    router.push(welcome_route);
    router.refresh();
  }, [router]);

  return (
    <Sidebar collapsible="none" className="border-r-1 min-w-fit px-4">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="mx-1 mt-2 flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-fit gap-2 font-medium">
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                    {getInitials(workspaceName)}
                  </span>
                  <span className="truncate">{workspaceName}</span>
                  <ChevronDown className="ml-1 size-3.5 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-56">
                {WORKSPACE_MENU.map(({ label, icon: Icon }) => (
                  <DropdownMenuItem key={label}>
                    <Icon className="size-4" />
                    {label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label="Search"
                    onClick={onSearch}
                  >
                    <Search className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Search</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label="New issue"
                    onClick={onNewIssue}
                  >
                    <Pen className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New issue</TooltipContent>
              </Tooltip>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Body */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {TOP_NAV.map((item) => (
                <NavRow
                  key={item.label}
                  item={item}
                  active={isActive(item.href)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Section label="Your teams">
          {TEAMS.map((team) => (
            <TeamNav key={team.id} team={team} isActive={isActive} />
          ))}
        </Section>

        <Section label="Favourites" icon={Star}>
          {WORKSPACE_NAV.map((item) => (
            <NavRow key={item.label} item={item} active={isActive(item.href)} />
          ))}
        </Section>
      </SidebarContent>
    </Sidebar>
  );
}
