import { motion } from "framer-motion";
import {
  User,
  CalendarDays,
  Phone,
  Mail,
  GraduationCap,
  MapPin,
} from "lucide-react";

const MobilePersonalInfo = ({ player }) => {
  const info = [
    {
      icon: User,
      label: "Gender",
      value: player.gender,
    },
    {
      icon: CalendarDays,
      label: "Date of Birth",
      value: new Date(player.dob).toLocaleDateString(),
    },
    {
      icon: Phone,
      label: "Phone",
      value: player.phone,
    },
    {
      icon: Mail,
      label: "Email",
      value: player.email,
    },
    {
      icon: GraduationCap,
      label: "Institute",
      value: player.institute,
    },
    {
      icon: MapPin,
      label: "Address",
      value: `${player.address.addressLine1}${
        player.address.addressLine2
          ? ", " + player.address.addressLine2
          : ""
      }, ${player.address.pincode}`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50"
    >

      {/* Header */}
      <div className="border-b border-blue-100 bg-blue-50 px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <User size={19} />
          </div>

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Personal Information
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Registered player details
            </p>

          </div>

        </div>

      </div>

      {/* Information */}
      <div className="divide-y divide-slate-100">

        {info.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-blue-50/40"
            >

              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Icon size={20} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">

                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  {item.label}
                </p>

                <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-800">
                  {item.value}
                </p>

              </div>

            </div>
          );
        })}

      </div>

    </motion.div>
  );
};

export default MobilePersonalInfo;