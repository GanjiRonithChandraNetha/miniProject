import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Users } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="bg-white p-6 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/admin/disputes')}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">View Disputes</h2>
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-gray-600">Review and manage ongoing disputes between users</p>
        </div>

        <div 
          className="bg-white p-6 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/admin/disputes/resolve')}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Resolve Disputes</h2>
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-gray-600">Take action on reported issues and conflicts</p>
        </div>

        <div 
          className="bg-white p-6 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/admin/users')}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Manage Users</h2>
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-gray-600">View and manage user accounts and permissions</p>
        </div>
      </div>

      {/* Recent Disputes */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Disputes</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {/* Sample disputes - replace with actual data */}
            {[1, 2, 3].map((dispute) => (
              <div key={dispute} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Payment Dispute #{dispute}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Reported 2 hours ago
                    </p>
                  </div>
                  <span className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded-full">
                    Pending
                  </span>
                </div>
                <p className="mt-3 text-gray-600">
                  Dispute between Freelancer and Client regarding milestone payment
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;