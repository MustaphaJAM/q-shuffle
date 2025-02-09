'use client';
import { Activity, Users, BookOpen, Clock } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { label: 'Active Exams', value: '12', icon: Activity, color: 'bg-blue-500' },
    { label: 'Total Students', value: '1,234', icon: Users, color: 'bg-green-500' },
    { label: 'Completed Exams', value: '89', icon: BookOpen, color: 'bg-violet-500' },
    { label: 'Avg. Duration', value: '45 min', icon: Clock, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Welcome Back, Admin!</h1>
        <p className="mt-2 text-gray-600">
          Here&apos;s what&apos;s happening with your exams today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-lg bg-white p-4">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg ${stat.color} p-2`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-600">{stat.label}</p>
                  <p className="truncate text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-2 border-b border-gray-200 pb-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">New exam submission</p>
                  <p className="truncate text-sm text-gray-600">Student completed Math Test #4</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">2h ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
