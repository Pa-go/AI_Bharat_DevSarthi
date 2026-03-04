export default function AppLayout({ children }) {
  return (
    /* This empty wrapper simply passes the theme colors down and lets your new Dashboard take up the full screen */
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {children}
    </div>
  );
}