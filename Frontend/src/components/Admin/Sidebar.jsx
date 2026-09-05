import { ShieldCheck } from "lucide-react";

import AdminNavigation from "./AdminNavigation";

const Sidebar = () => (
  <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 self-start flex-col border-r border-slate-800 bg-slate-900 text-white lg:flex">
    <div className="flex min-h-20 items-center gap-3 border-b border-slate-700 px-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600">
        <ShieldCheck size={23} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-lg font-bold">ASFC Admin</p>
        <p className="text-xs text-slate-400">Management portal</p>
      </div>
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 scrollbar-thin scrollbar-thumb-slate-700">
      <AdminNavigation />
    </div>
  </aside>
);

export default Sidebar;
