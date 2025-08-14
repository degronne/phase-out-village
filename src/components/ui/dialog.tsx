import React, { ReactNode, useEffect, useLayoutEffect, useRef } from "react";

export function Dialog({
  children,
  onClose,
  open,
  className,
}: {
  open: boolean;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  useLayoutEffect(() => {
    function handleClick(e: MouseEvent) {
      const dialog = dialogRef.current;
      if (dialog && dialog.open && dialog.contains(e.target as Node)) {
        const rect = dialog.getBoundingClientRect();
        const clickedInDialog =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        if (!clickedInDialog) dialog.close();
      }
    }

    window.addEventListener("click", handleClick);
    dialogRef.current?.showModal();
    if (onClose) dialogRef.current?.addEventListener("close", onClose);
    return () => {
      if (onClose) dialogRef.current?.removeEventListener("close", onClose);
      window.removeEventListener("click", handleClick);
    };
  }, []);
  useEffect(() => {
    if (open) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [open]);
  return (
    <dialog ref={dialogRef} className={className}>
      {children}
    </dialog>
  );
}
