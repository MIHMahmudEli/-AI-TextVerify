"use client";

import { useSyncExternalStore } from "react";

/* The theme lives on <html class="dark"> (set pre-hydration in layout.tsx),
   so subscribe to that attribute rather than duplicating it in React state. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("pird-theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle light / dark mode"
      className="cursor-pointer border border-line bg-panel px-4 py-1.5 text-[0.68rem]
                 uppercase tracking-[0.2em] text-ink-soft transition-colors
                 hover:border-accent hover:text-accent-strong"
    >
      {dark ? "☀ light mode" : "☾ dark mode"}
    </button>
  );
}
