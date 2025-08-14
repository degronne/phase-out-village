import React, { ReactNode } from "react";

export function InfoTag({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <span
      title={title}
      style={{ cursor: "help", borderBottom: "1px dotted currentColor" }}
    >
      {children ?? "(?)"}
    </span>
  );
}
