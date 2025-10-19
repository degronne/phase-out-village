import React, { ReactNode } from "react";

/**
 * A small inline info indicator component that shows a tooltip on hover.
 *
 * Typically used to provide extra information or clarification without
 * taking up extra space in the layout.
 *
 * @param {object} props - The component props.
 * @param {string} props.title - The tooltip text shown on hover.
 * @param {ReactNode} [props.children] - Optional content inside the tag.
 *   If omitted, a default "(?)" symbol is displayed.
 *
 * @example
 * <p>
 *   Speed limit <InfoTag title="The maximum allowed speed in km/h">(info)</InfoTag>
 * </p>
 */
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
