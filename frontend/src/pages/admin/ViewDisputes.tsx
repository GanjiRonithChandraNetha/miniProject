import React, { useState, useEffect } from 'react';
import { issues } from '../../lib/api';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const ViewDisputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const response = await issues.get();
        setDisputes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching disputes:', error);
        setLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">All Disputes</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {disputes.map((dispute: any) => (
            <div key={dispute.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(dispute.status)}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {dispute.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Reported by {dispute.reportedBy} • Case #{dispute.id}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  dispute.status === 'resolved'
                    ? 'bg-green-100 text-green-700'
                    : dispute.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {dispute.status}
                </span>
              </div>
              <p className="mt-4 text-gray-600">{dispute.description}</p>
              <div className="mt-4 flex justify-end space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  View Details
                </button>
                <button className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700">
                  Take Action
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewDisputes;