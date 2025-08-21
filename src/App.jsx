import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { motion } from "framer-motion";

const DEFAULT_ZONE = "Asia/Kathmandu";

const subscriptionCycle = {
  plan: "ChatGPT Plus",
  timezone: DEFAULT_ZONE,
  startISO: "2025-08-20T07:18:00+05:45",
  endISO: "2025-09-20T07:18:00+05:45",
  reminders: {
    halfway: true,
    threeDays: true,
    lastDay: true,
    renewal: true,
  },
  theme: "system",
  hourFormat: "24h",
};

function msToParts(ms) {
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds };
}

export default function App() {
  const [now, setNow] = useState(DateTime.now().setZone(DEFAULT_ZONE));

  useEffect(() => {
    const id = setInterval(() => {
      setNow(DateTime.now().setZone(DEFAULT_ZONE));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const start = DateTime.fromISO(subscriptionCycle.startISO).setZone(DEFAULT_ZONE);
  const end = DateTime.fromISO(subscriptionCycle.endISO).setZone(DEFAULT_ZONE);
  const total = end.toMillis() - start.toMillis();
  const elapsed = Math.max(0, Math.min(total, now.toMillis() - start.toMillis()));
  const remaining = total - elapsed;
  const progress = elapsed / total;

  const { days, hours, minutes } = msToParts(remaining);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">GPT Deadline</h1>
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="90"
            strokeWidth="12"
            stroke="currentColor"
            className="text-gray-300"
            fill="none"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="90"
            strokeWidth="12"
            stroke="currentColor"
            className="text-blue-500"
            fill="none"
            strokeDasharray={2 * Math.PI * 90}
            strokeDashoffset={(1 - progress) * 2 * Math.PI * 90}
            initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
            animate={{ strokeDashoffset: (1 - progress) * 2 * Math.PI * 90 }}
            transition={{ duration: 1 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{days}d</span>
          <span className="text-sm text-gray-500">{hours}h {minutes}m</span>
        </div>
      </div>
      <p className="mt-4 text-gray-700">
        Cycle: {start.toFormat("MMM dd, hh:mm a")} → {end.toFormat("MMM dd, hh:mm a")}
      </p>
    </div>
  );
}
