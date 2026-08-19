import { CalendarCheck2, Check, Percent, X } from "lucide-react";

const PlayerAttendanceStats = ({ statistics }) => {
  const items = [
    {
      label: "Sessions",
      value: statistics.totalSessions,
      icon: CalendarCheck2,
      style: "bg-blue-50 text-blue-700",
    },
    {
      label: "Present",
      value: statistics.presentCount,
      icon: Check,
      style: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Absent",
      value: statistics.absentCount,
      icon: X,
      style: "bg-rose-50 text-rose-700",
    },
    {
      label: "Attendance",
      value: `${statistics.attendancePercentage}%`,
      icon: Percent,
      style: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className={`rounded-2xl p-4 ${item.style}`}>
            <Icon size={19} />
            <p className="mt-3 text-2xl font-bold">{item.value}</p>
            <p className="mt-0.5 text-xs font-semibold">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerAttendanceStats;
