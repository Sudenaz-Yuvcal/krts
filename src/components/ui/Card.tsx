import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`bg-white rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] border border-slate-100/60 p-8 ${className}`}
    >
      {children}
    </div>
  );
};
