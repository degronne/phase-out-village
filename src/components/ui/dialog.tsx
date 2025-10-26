import React, { ReactNode, useEffect, useLayoutEffect, useRef } from "react";

/**
 * A reusable dialog component based on the native `<dialog>` HTML element.
 *
 * This component supports both programmatic and user-triggered closing,
 * and automatically closes when a click occurs outside the dialog box.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.open - Whether the dialog is open or closed.
 * @param {ReactNode} props.children - The content of the dialog.
 * @param {() => void} [props.onClose] - Optional callback invoked when the dialog closes.
 * @param {string} [props.className] - Optional CSS class name for custom styling.
 *
 * @example
 * <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
 *   <p>Hello!</p>
 * </Dialog>
 */
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
  // Reference to the <dialog> element for direct DOM control.
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  
  useLayoutEffect(() => {
    /**
     * Handles clicks anywhere in the window. If the click occurs outside
     * the dialog box, the dialog will be closed.
     */
    function handleClick(e: MouseEvent) {
      const dialog = dialogRef.current;
      if (dialog && dialog.open && dialog.contains(e.target as Node)) {
        // Determine if click is inside the dialog bounds.
        const rect = dialog.getBoundingClientRect();
        const clickedInDialog =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        if (!clickedInDialog) dialog.close(); // Close if the click was outside.
      }
      // Possible alternative way?
      // Close only if the click target is *outside* the dialog element
      // if (!dialog.contains(e.target as Node)) {
      //   dialog.close();
      // }
    }

    window.addEventListener("click", handleClick); // Attach listeners for close and click events.
    dialogRef.current?.showModal();  // Show the dialog when mounted.
    if (onClose) dialogRef.current?.addEventListener("close", onClose);

    // Cleanup: remove all listeners on unmount.
    return () => {
      if (onClose) dialogRef.current?.removeEventListener("close", onClose);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  // Sync the dialog's open state with the boolean 'open'.
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
