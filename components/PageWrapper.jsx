"use client";
import { useEffect, useState } from "react";

export default function PageWrapper({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Sync theme locally without touching the global layout
    const savedTheme = localStorage.getItem("devSathiTheme") || "dark";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  if (!isMounted) return null; // Prevents the crash on local and deployment

  return <>{children}</>;
}