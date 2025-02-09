'use client';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside className="fixed flex h-screen w-64 flex-col bg-gray-800 text-white">
        <div className="border-b border-gray-700 p-4 text-lg font-bold">Dashboard</div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="mt-4 space-y-1">
            <li>
              <Link
                href="/dashboard/exams"
                className="block rounded px-4 py-3 transition hover:bg-gray-700"
              >
                Manage Exams
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/answers"
                className="block rounded px-4 py-3 transition hover:bg-gray-700"
              >
                Track Answers
              </Link>
            </li>
          </ul>
        </nav>
        <button
          onClick={() => signOut()}
          className="w-full bg-red-500 px-4 py-3 text-left font-semibold text-white transition hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main Content - Scrollable */}
      <div className="ml-64 flex-1">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-300 bg-gray-100 p-4">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        </header>

        {/* Content - Scrollable */}
        <main className="min-h-screen flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
}
