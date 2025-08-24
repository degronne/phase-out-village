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
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleKeyDown(e: KeyboardEvent) {
      const d = dialogRef.current;
      if (!d) return;
      if (e.key === "Escape") {
        e.stopPropagation();
        d.close();
        return;
      }
      if (e.key === "Tab") {
        const focusables = Array.from(
          d.querySelectorAll<HTMLElement>(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !d.contains(active)) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (active === last || !d.contains(active)) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    }

    dialog.addEventListener("keydown", handleKeyDown);
    if (onClose) dialog.addEventListener("close", onClose);

    return () => {
      if (onClose) dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function focusFirst() {
      requestAnimationFrame(() => {
        const d = dialogRef.current;
        if (!d) return;
        const focusables = Array.from(
          d.querySelectorAll<HTMLElement>(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
        (focusables[0] ?? d).focus();
      });
    }
    if (open) {
      if (!dialog.open) dialog.showModal();
      focusFirst();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [open]);

  return (
    <dialog ref={dialogRef} className={className}>
      {children}
    </dialog>
  );
}
