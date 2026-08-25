import { Check, Minus, X } from "lucide-react";

import { SESSION_LABELS, getStatusClasses, getStatusText } from "./monthly-attendance-utils";

const getMobileStatusIcon = (status) => {
  if (status === "Present") return <Check aria-hidden="true" size={15} strokeWidth={3} />;
  if (status === "Absent") return <X aria-hidden="true" size={15} strokeWidth={3} />;
  return <Minus aria-hidden="true" size={15} strokeWidth={2.5} />;
};

const AttendanceCell = ({ attendance = {}, dateLabel, stacked = false }) => (
  <div className={stacked ? "grid grid-rows-2" : "flex items-center justify-center gap-1.5"}>
    {SESSION_LABELS.map(({ key, shortLabel }, index) => {
      const status = attendance[key];
      return (
        <span
          key={key}
          title={`${key}: ${getStatusText(status)}`}
          aria-label={`${dateLabel}, ${key}: ${getStatusText(status)}`}
          className={`${getStatusClasses(status)} ${stacked ? "flex h-9 items-center justify-center border-b border-slate-800 last:border-b-0" : "font-bold"}`}
        >
          {stacked ? getMobileStatusIcon(status) : status === "Present" ? shortLabel : status === "Absent" ? shortLabel : "—"}
          {!stacked && index === 0 && <span aria-hidden="true" className="ml-1.5 text-slate-700">/</span>}
        </span>
      );
    })}
  </div>
);

export default AttendanceCell;
