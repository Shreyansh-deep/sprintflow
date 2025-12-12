import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900/70 text-xs text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-3 sm:flex-row">
        <span>© {new Date().getFullYear()} SprintFlow</span>
        <div className="flex flex-wrap items-center gap-3">
          <span>Built by Shreyansh Deep</span>
          <Link
            href="https://github.com/Shreyansh-deep"
            target="_blank"
            className="hover:text-sky-400"
          >
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/shreyansh-deep-a8b933145/"
            target="_blank"
            className="hover:text-sky-400"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
