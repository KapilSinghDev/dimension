import React from "react";

const ToolbarButton = ({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    type="button"
    className={`p-1.5 rounded hover:bg-muted cursor-pointer transition-colors ${active ? "bg-muted text-foreground" : "text-muted-foreground"}`}
  >
    {children}
  </button>
);
export default ToolbarButton;
