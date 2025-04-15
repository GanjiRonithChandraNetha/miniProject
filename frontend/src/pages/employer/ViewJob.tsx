import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employer } from '../../lib/api';
import { Edit2, Users, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ViewJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState<any>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await employer.getJobs();
        const foundJob = response.data.find((j: any) => j.id === jobId);
        setJob(foundJob);
        setEditedJob(foundJob);
      } catch (error) {
        toast.error('Failed to fetch job details');
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const handleUpdate = async () => {
    try {
      await employer.updateJob(jobId!, editedJob);
      setJob(editedJob);
      setIsEditing(false);
      toast.success('Job updated successfully');
    } catch (error) {
      toast.error('Failed to update job');
    }
  };

  const handleSendAgreement = async () => {
    try {
      await employer.sendAgreement(jobId!);
      toast.success('Agreement sent successfully');
    } catch (error) {
      toast.error('Failed to send agreement');
    }
  };

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/employer/jobs/${jobId}/applicants`)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Users className="h-5 w-5 mr-2" />
            View Applicants
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Edit2 className="h-5 w-5 mr-2" />
            {isEditing ? 'Cancel Edit' : 'Edit Job'}
          </button>
          <button
            onClick={handleSendAgreement}
            className="flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Send className="h-5 w-5 mr-2" />
            Send Agreement
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={editedJob.title}
                  onChange={(e) => setEditedJob({ ...editedJob, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editedJob.description}
                  onChange={(e) => setEditedJob({ ...editedJob, description: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget ($)</label>
                  <input
                    type="number"
                    value={editedJob.budget}
                    onChange={(e) => setEditedJob({ ...editedJob, budget: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
                  <input
                    type="number"
                    value={editedJob.duration}
                    onChange={(e) => setEditedJob({ ...editedJob, duration: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                <p className="mt-4 text-gray-600">{job.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">${job.budget}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">{job.duration} days</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Required Skills</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewJob;