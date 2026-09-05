import {
  CalendarCheck,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  Medal,
  PlusCircle,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";

export const adminNavigation = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard, end: true },
  {
    label: "Players",
    icon: Users,
    children: [
      { label: "Player List", to: "/admin/dashboard/players", icon: Users },
      { label: "Player Requests", to: "/admin/dashboard/requests", icon: UserCheck },
    ],
  },
  {
    label: "Attendance",
    icon: CalendarCheck,
    children: [
      { label: "Mark Attendance", to: "/admin/attendance/mark", icon: ClipboardCheck },
      { label: "Attendance Records", to: "/admin/attendance/records", icon: ListChecks },
      { label: "Monthly Register", to: "/admin/attendance/monthly", icon: CalendarDays },
    ],
  },
  {
    label: "Tournaments",
    icon: Trophy,
    children: [
      { label: "All Tournaments", to: "/admin/dashboard/tournaments", icon: Trophy },
      { label: "Add Tournament", to: "/admin/dashboard/add-tournament", icon: PlusCircle },
      { label: "Tournament Entries", to: "/admin/dashboard/entries", icon: ClipboardList },
    ],
  },
  {
    label: "Results",
    icon: Medal,
    children: [
      { label: "Club Results", to: "/admin/dashboard/club-results", icon: Trophy },
      { label: "Individual Results", to: "/admin/dashboard/individual-results", icon: Medal },
      { label: "Team Results", to: "/admin/dashboard/team-results", icon: Users },
    ],
  },
];

const routeTitles = adminNavigation.flatMap((item) => item.children || [item]);

export const getAdminPageTitle = (pathname) => {
  const exactMatch = routeTitles.find((item) => item.to === pathname);
  if (exactMatch) return exactMatch.label;
  if (pathname.startsWith("/admin/attendance")) return "Attendance";
  if (pathname.startsWith("/admin/dashboard/merit-certificates")) return "Merit Certificates";
  if (pathname.startsWith("/admin/dashboard/participation-certificates")) return "Participation Certificates";
  return "Admin Dashboard";
};
