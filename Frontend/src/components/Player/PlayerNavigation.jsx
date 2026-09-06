import { ExternalLink } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { playerNavigation } from "./playerNavigationConfig";

const isNavigationItemActive = (item, pathname, hash) => {
  const [itemPath, itemHash = ""] = item.to.split("#");

  if (pathname !== itemPath) return false;
  if (item.exactHash) return !hash;
  if (itemHash) return hash === `#${itemHash}`;
  return true;
};

const PlayerNavigationLink = ({ item, onNavigate }) => {
  const { pathname, hash } = useLocation();
  const Icon = item.icon;
  const isActive = isNavigationItemActive(item, pathname, hash);

  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={`flex min-h-11 min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition motion-reduce:transition-none ${
        isActive
          ? "bg-blue-600 text-white shadow-sm"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon size={19} className="shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.portalExit && (
        <ExternalLink
          size={14}
          className="shrink-0 text-slate-400"
          aria-label="Opens the ASFC public tournament calendar"
        />
      )}
    </Link>
  );
};

const PlayerNavigation = ({ onNavigate }) => (
  <nav aria-label="Player portal navigation" className="space-y-5">
    {playerNavigation.map((group) => {
      if (group.to) {
        return (
          <PlayerNavigationLink
            key={group.to}
            item={group}
            onNavigate={onNavigate}
          />
        );
      }

      return (
        <section key={group.label} aria-labelledby={`player-nav-${group.label}`}>
          <h2
            id={`player-nav-${group.label}`}
            className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500"
          >
            {group.label}
          </h2>
          <div className="space-y-1">
            {group.items.map((item) => (
              <PlayerNavigationLink
                key={item.to}
                item={item}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </section>
      );
    })}
  </nav>
);

export default PlayerNavigation;

