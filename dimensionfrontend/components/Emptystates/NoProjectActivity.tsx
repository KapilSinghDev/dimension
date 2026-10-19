import React from "react";

type NoProjectActivityProps = {
  title?: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
};

const NoProjectActivity = ({
  title = "No activity yet",
  description = "Updates, comments, and changes for this project will show up here.",
  className = "",
  action,
}: NoProjectActivityProps) => {
  return (
    <div
      className={`flex min-h-[260px] w-full flex-col items-center justify-center px-6 py-12 text-center ${className}`}
    >
      <div className="mb-6 flex h-32 w-40 items-center justify-center">
        <svg
          width="160"
          height="128"
          viewBox="0 0 160 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          aria-hidden="true"
        >
          {/* soft ground shadow */}
          <ellipse cx="80" cy="118" rx="42" ry="6" fill="#E4E4E7" />

          {/* clipboard / activity board */}
          <rect
            x="42"
            y="18"
            width="76"
            height="90"
            rx="10"
            fill="#FFFFFF"
            stroke="#A1A1AA"
            strokeWidth="2"
          />
          <rect
            x="58"
            y="10"
            width="44"
            height="16"
            rx="6"
            fill="#F4F4F5"
            stroke="#A1A1AA"
            strokeWidth="2"
          />
          <rect x="70" y="15" width="20" height="6" rx="3" fill="#D4D4D8" />

          {/* empty activity rows */}
          <rect x="54" y="42" width="52" height="8" rx="4" fill="#E4E4E7" />
          <rect x="54" y="58" width="40" height="8" rx="4" fill="#E4E4E7" />
          <rect x="54" y="74" width="46" height="8" rx="4" fill="#E4E4E7" />

          {/* dashed “waiting” ring */}
          <circle
            cx="118"
            cy="34"
            r="16"
            stroke="#6366F1"
            strokeWidth="2"
            strokeDasharray="4 4"
            fill="#EEF2FF"
          />
          {/* pulse dot */}
          <circle cx="118" cy="34" r="4" fill="#6366F1" />

          {/* small spark marks */}
          <path
            d="M132 18v6M129 21h6"
            stroke="#818CF8"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M104 22v4M102 24h4"
            stroke="#A5B4FC"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h3 className="text-base font-semibold tracking-tight text-zinc-900">
        {title}
      </h3>
      <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-zinc-500">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default NoProjectActivity;
