import { createElement } from "react";
import { ArrowRight, ClipboardList, Medal, PlusCircle, Trophy, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

const quickActions = [
  {
    label: "Player Requests",
    description: "Review pending player registrations.",
    to: "/admin/dashboard/requests",
    icon: UserCheck,
  },
  {
    label: "Mark Attendance",
    description: "Record attendance for club sessions.",
    to: "/admin/attendance/mark",
    icon: ClipboardList,
  },
  {
    label: "Add Tournament",
    description: "Create a new tournament record.",
    to: "/admin/dashboard/add-tournament",
    icon: PlusCircle,
  },
  {
    label: "Tournament Entries",
    description: "Register eligible players for tournaments.",
    to: "/admin/dashboard/entries",
    icon: Trophy,
  },
  {
    label: "Club Results",
    description: "View club medals and performance.",
    to: "/admin/dashboard/club-results",
    icon: Medal,
  },
  {
    label: "Individual Results",
    description: "Declare individual medal results.",
    to: "/admin/dashboard/individual-results",
    icon: UserCheck,
  },
];

const AdminDashboardHome = () => (
  <main className="min-h-full min-w-0 bg-slate-50 px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
    <div className="mx-auto min-w-0 max-w-7xl">
      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-slate-100 px-5 py-6 shadow-sm sm:px-7 sm:py-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Admin</p>
        <h1 className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Hello, Admin</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Welcome back to All Star Fencing Club. Manage players, attendance,
          tournaments and results from one place.
        </p>
      </section>

      <section className="mt-7 sm:mt-9" aria-labelledby="quick-actions-title">
        <div className="mb-4">
          <h2 id="quick-actions-title" className="text-xl font-bold text-slate-900 sm:text-2xl">Quick Actions</h2>
          <p className="mt-1 text-sm text-slate-500">Go directly to common administration tasks.</p>
        </div>

        <nav aria-label="Quick actions" className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {quickActions.map(({ label, description, to, icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex min-h-32 min-w-0 items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:p-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                {createElement(icon, { size: 21 })}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block break-words font-bold text-slate-900">{label}</span>
                <span className="mt-1 block break-words text-sm leading-5 text-slate-500">{description}</span>
              </span>
              <ArrowRight size={19} className="mt-1 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </section>
    </div>
  </main>
);

export default AdminDashboardHome;
