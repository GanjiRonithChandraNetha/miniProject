import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Check, X, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ViewJobs = () => {
  const [vacantJobs, setVacantJobs] = useState([]);
  const [engagedJobs, setEngagedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Replace with your actual endpoint
      const response = await axios.get('http://localhost:3636/v1/application/employer/job/read',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("FreeToken")}`, // Example: Authorization header
            'Content-Type': 'application/json',     // Example: Content-Type
          },
        }
      );
      
      if (response.data) {
        setVacantJobs(response.data.vacantJobs || []);
        setEngagedJobs(response.data.engagedJobs || []);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch jobs');
      setLoading(false);
      console.error('Error fetching jobs:', err);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job._id);
    setFormData({
      title: job.title,
      description: job.description,
      budget: job.budget,
      deadline: new Date(job.deadline).toISOString().split('T')[0],
      skills: job.skills.join(', ')
    });
  };

  const handleCancelEdit = () => {
    setEditingJob(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (jobId) => {
    try {
      const updatedData = {};
      
      if (formData.title) updatedData.title = formData.title;
      if (formData.description) updatedData.description = formData.description;
      if (formData.budget) updatedData.budget = Number(formData.budget);
      if (formData.deadline) updatedData.deadline = new Date(formData.deadline).toISOString();
      if (formData.skills) updatedData.skills = formData.skills.split(',').map(skill => skill.trim());

      console.log(jobId)

      const res = await axios.put('http://localhost:3636/v1/application/employer/job/update', {
          jobId: jobId,
          data: updatedData
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("FreeToken")}`, // Example: Authorization header
            'Content-Type': 'application/json',     // Example: Content-Type
          },
        }
      );

      console.log(res);

      // Refresh job data after successful update
      fetchJobs();
      setEditingJob(null);
      setFormData({});
    } catch (err) {
      console.error('Error updating job:', err);
      alert('Failed to update job details');
    }
  };

  const viewApplicants = (jobId) => {
    navigate(`/applicants/${jobId}`);
  };

  const renderJobCard = (job, isEditing) => {
    const jobData = job.job || job;
    
    if (isEditing) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4" key={jobData._id}>
          <div className="flex justify-between items-center mb-4">
            <input
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              className="text-xl font-bold w-full p-2 border rounded"
            />
            <div className="flex space-x-2">
              <button 
                onClick={() => handleSubmit(jobData._id)} 
                className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <Check size={20} />
              </button>
              <button 
                onClick={handleCancelEdit} 
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded min-h-32"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">Budget</label>
              <input
                name="budget"
                type="number"
                value={formData.budget || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Deadline</label>
              <input
                name="deadline"
                type="date"
                value={formData.deadline || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Skills (comma separated)</label>
            <input
              name="skills"
              value={formData.skills || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-4" key={jobData._id}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{jobData.title}</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleEdit(jobData)} 
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Edit size={20} />
            </button>
            <button 
              onClick={() => viewApplicants(jobData._id)} 
              className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              <Users size={20} />
            </button>
          </div>
        </div>

        <div className="mb-4 whitespace-pre-line text-gray-700">
          {jobData.description}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <span className="font-semibold">Budget:</span> ${jobData.budget.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Deadline:</span> {new Date(jobData.deadline).toLocaleDateString()}
          </div>
        </div>

        <div className="mb-2">
          <span className="font-semibold">Status:</span> 
          <span className={`ml-2 ${jobData.status === 'vacant' ? 'text-green-600' : 'text-blue-600'}`}>
            {jobData.status.charAt(0).toUpperCase() + jobData.status.slice(1)}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {jobData.skills.map((skill, index) => (
            <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <div className="text-center p-8">Loading jobs...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Jobs</h1>
      
      {vacantJobs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Vacant Jobs</h2>
          {vacantJobs.map(job => renderJobCard(job, editingJob === job.job._id))}
        </div>
      )}
      
      {engagedJobs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Engaged Jobs</h2>
          {engagedJobs.map(job => renderJobCard(job, editingJob === job.job._id))}
        </div>
      )}
      
      {vacantJobs.length === 0 && engagedJobs.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No jobs found. Create a new job to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ViewJobs;