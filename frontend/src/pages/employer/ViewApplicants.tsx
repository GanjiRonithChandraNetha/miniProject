import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { employer } from '../../lib/api';
import { Star, Download, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ViewApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await employer.getApplicants(jobId!);
        setApplicants(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch applicants');
        setLoading(false);
      }
    };

    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Job Applicants</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {applicants.map((applicant: any) => (
            <div key={applicant.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={applicant.avatar}
                    alt={applicant.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{applicant.name}</h2>
                    <div className="flex items-center mt-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{applicant.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-1" />
                    Resume
                  </button>
                  <button className="flex items-center px-3 py-1 bg-indigo-600 border border-transparent rounded text-sm text-white hover:bg-indigo-700">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Select
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">Cover Letter</h3>
                <p className="mt-2 text-sm text-gray-600">{applicant.coverLetter}</p>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">Skills</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {applicant.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Applied {new Date(applicant.appliedAt).toLocaleDateString()}
                </span>
                <span className="text-gray-500">
                  Bid: ${applicant.bidAmount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewApplicants;