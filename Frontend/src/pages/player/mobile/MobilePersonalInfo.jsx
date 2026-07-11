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
      className="rounded-3xl bg-white shadow-lg overflow-hidden"
    >
      <div className="px-5 py-4 border-b">
        <h2 className="text-lg font-bold text-gray-800">
          Personal Information
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Registered player details
        </p>
      </div>

      <div className="divide-y">
        {info.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-start gap-4 px-5 py-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                <Icon size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {item.label}
                </p>

                <p className="mt-1 break-words text-sm font-semibold text-gray-800">
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