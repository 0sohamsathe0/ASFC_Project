import {
  BookOpen,
  CalendarCheck2,
  LayoutDashboard,
  Medal,
  Trophy,
  UserRound,
} from "lucide-react";

export const playerNavigation = [
  {
    label: "Dashboard",
    to: "/player/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Train",
    items: [
      {
        label: "Attendance",
        to: "/player/attendance",
        icon: CalendarCheck2,
      },
    ],
  },
  {
    label: "Compete",
    items: [
      {
        label: "Tournaments",
        to: "/player/tournaments",
        icon: Trophy,
      },
      {
        label: "Achievements",
        to: "/player/achievements",
        icon: Medal,
      },
    ],
  },
  {
    label: "Learn",
    items: [
      {
        label: "Learn to Fence",
        to: "/player/dashboard#learn-to-fence",
        icon: BookOpen,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        label: "My Profile",
        to: "/player/profile",
        icon: UserRound,
        exactHash: true,
      },
    ],
  },
];

const routeTitles = [
  { path: "/player/dashboard", title: "Dashboard" },
  { path: "/player/attendance", title: "Attendance" },
  { path: "/player/tournaments", title: "Tournaments" },
  { path: "/player/achievements", title: "Achievements" },
  { path: "/player/profile", title: "My Profile" },
];

export const getPlayerPageTitle = (pathname) =>
  routeTitles.find(({ path }) => pathname.startsWith(path))?.title ||
  "Player Portal";
