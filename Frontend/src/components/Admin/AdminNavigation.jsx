import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import { adminNavigation } from "./adminNavigationConfig";

const AdminNavigation = ({ onNavigate }) => {
  const { pathname } = useLocation();
  const previousPathname = useRef(pathname);
  const [openGroups, setOpenGroups] = useState(() =>
    Object.fromEntries(
      adminNavigation
        .filter((item) =>
          item.children?.some((child) => pathname.startsWith(child.to))
        )
        .map((item) => [item.label, true])
    )
  );

  useEffect(() => {
    if (previousPathname.current === pathname) return;

    const activeGroup = adminNavigation.find((item) =>
      item.children?.some((child) => pathname.startsWith(child.to))
    );

    if (activeGroup) {
      // A route change should reveal its group without overriding later manual toggles.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenGroups((current) => ({
        ...current,
        [activeGroup.label]: true,
      }));
    }

    previousPathname.current = pathname;
  }, [pathname]);

  const linkClass = ({ isActive }) =>
    `flex min-h-11 min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <nav aria-label="Admin navigation" className="space-y-1.5">
      {adminNavigation.map((item) => {
        const Icon = item.icon;

        if (!item.children) {
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={linkClass}
            >
              <Icon size={19} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        }

        const isGroupActive = item.children.some((child) =>
          pathname.startsWith(child.to)
        );
        const isOpen = Boolean(openGroups[item.label]);
        const groupPanelId = `admin-navigation-${item.label.toLowerCase().replaceAll(" ", "-")}`;

        return (
          <div key={item.label}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={groupPanelId}
              onClick={() =>
                setOpenGroups((current) => ({
                  ...current,
                  [item.label]: !current[item.label],
                }))
              }
              className={`flex min-h-11 w-full min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                isGroupActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={19} className="shrink-0" />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              <ChevronDown
                size={17}
                className={`shrink-0 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div id={groupPanelId} className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-3">
                {item.children.map((child) => {
                  const ChildIcon = child.icon;
                  return (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      end={child.end}
                      onClick={onNavigate}
                      className={linkClass}
                    >
                      <ChildIcon size={17} className="shrink-0" />
                      <span className="min-w-0 break-words">{child.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default AdminNavigation;
