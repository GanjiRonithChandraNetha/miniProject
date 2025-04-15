import React from 'react';
import { Briefcase, DollarSign, Clock, Star, TrendingUp, Users } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Active Projects', value: '4', icon: Briefcase, trend: '+2 this month' },
    { label: 'Total Earnings', value: '$12,450', icon: DollarSign, trend: '+15% vs last month' },
    { label: 'Hours Worked', value: '156', icon: Clock, trend: '32 this week' },
    { label: 'Rating', value: '4.9', icon: Star, trend: 'From 124 reviews' },
  ];

  const recentProjects = [
    {
      id: 1,
      title: 'E-commerce Website Redesign',
      client: 'Tech Solutions Inc.',
      status: 'In Progress',
      dueDate: '2024-03-25',
      progress: 65,
    },
    {
      id: 2,
      title: 'Mobile App Development',
      client: 'StartUp Labs',
      status: 'In Review',
      dueDate: '2024-04-10',
      progress: 90,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">{stat.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Active Projects</h2>
                <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentProjects.map((project) => (
                <div key={project.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-500">{project.client}</p>
                    </div>
                    <span className="px-3 py-1 text-sm text-yellow-700 bg-yellow-100 rounded-full">
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-indigo-600 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    Due date: {project.dueDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                <li className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">
                        Received payment for{' '}
                        <a href="#" className="font-medium text-gray-900">
                          Website Development
                        </a>
                      </p>
                      <p className="mt-1 text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                </li>
                <li className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">
                        New project invitation from{' '}
                        <a href="#" className="font-medium text-gray-900">
                          Tech Solutions Inc.
                        </a>
                      </p>
                      <p className="mt-1 text-sm text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                </li>
                <li className="relative">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-indigo-600" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">
                        Completed milestone for{' '}
                        <a href="#" className="font-medium text-gray-900">
                          Mobile App Project
                        </a>
                      </p>
                      <p className="mt-1 text-sm text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;