import React from "react";

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({children, ...props}) => (
  <button className="px-4 py-2 rounded-2xl shadow text-sm font-medium border" {...props}>{children}</button>
);

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({children, ...props}) => (
  <div className="rounded-2xl shadow p-4 bg-white" {...props}>{children}</div>
);
