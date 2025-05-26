import React, { useRef, useState } from "react";

/*
 * Simple toast hook.
 *
 * milliseconds before the toast fades (default 5000)
 * show(message) triggers a toast;  Toast is the component to render
 */
export function useToast(duration = 5000) {
  const [msg, setMsg] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Call this from anywhere to display a toast
  const show = (text: string) => {
    setMsg(text);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setMsg(null);
      timerRef.current = null;
    }, duration);
  };

  // JSX element (or null) you placed in App component once
  const Toast = msg ? (
    <div
      className="toast"
      style={{ position: "fixed", top: 12, right: 12, zIndex: 999 }}
    >
      {msg}
    </div>
  ) : null;

  return { showToast: show, Toast };
}
