"use client";
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-gray-800 text-white flex flex-col fixed h-screen">
                <div className="p-4 text-lg font-bold border-b border-gray-700">
                    Dashboard
                </div>
                <nav className="flex-1 overflow-y-auto">
                    <ul className="space-y-1 mt-4">
                        <li>
                            <Link
                                href="/dashboard/exams"
                                className="block px-4 py-3 hover:bg-gray-700 rounded transition"
                            >
                                Manage Exams
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/dashboard/answers"
                                className="block px-4 py-3 hover:bg-gray-700 rounded transition"
                            >
                                Track Answers
                            </Link>
                        </li>
                    </ul>
                </nav>
                <button
                    onClick={() => signOut()}
                    className="w-full px-4 py-3 text-left bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                >
                    Logout
                </button>
            </aside>

            {/* Main Content - Scrollable */}
            <div className="flex-1 ml-64">
                <header className="bg-gray-100 p-4 border-b border-gray-300 flex items-center justify-between sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                </header>

                {/* Content - Scrollable */}
                <main className="flex-1 p-6 bg-gray-50 min-h-screen overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}