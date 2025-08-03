"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import LanguageTranslationComponent from "./language";
import { ThemeSwitcher } from "./themeswitch";
import { useUser } from "@/lib/UserContext"; // 🔥 import the hook

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "voice", url: "voice" },
        { title: "input", url: "input" },
        { title: "profile", url: "profile" },
        { title: "files", url: "files" },
        { title: "Feedback", url: "feedback" },
      ],
    },
    {
      title: "Models",
      url: "",
      icon: Bot,
      items: [
        { title: "Madhav", url: "/dashboard/madhav" },
        { title: "meet", url: "/dashboard/meet" },
        { title: "kush", url: "/dashboard/kush" },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
        { title: "Changelog", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser(); // 🔥 get logged in user
  console.log(user)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <ThemeSwitcher />
      </SidebarContent>
      <SidebarFooter>
        <LanguageTranslationComponent />
        <NavUser
          user={{
            name: user?.user_metadata?.full_name || user?.email || "Guest",
            email: user?.email || "",
            avatar: user?.user_metadata.avatar_url,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
