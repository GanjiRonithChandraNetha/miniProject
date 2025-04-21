import React, { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, Filter, Calendar, DollarSign, Award, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState({ vacantJobs: [], engagedJobs: [] });
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);

  // Create a debounced search function using useCallback
  const debouncedSearch = useCallback(
    (() => {
      let timer;
      return (searchQuery) => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(async () => {
          setLoading(true);
          try {
            const response = await axios.get(`http://localhost:3636/v1/application/search`, {
                params: { search: searchQuery },
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("FreeToken")}`, // Example: Authorization header
                  'Content-Type': 'application/json',     // Example: Content-Type
                },
              }
            );
            setJobs(response.data);
          } catch (error) {
            console.error('Error fetching jobs:', error);
          } finally {
            setLoading(false);
          }
        }, 500); // 500ms delay
      };
    })(),
    []
  );

  // Effect to trigger search when searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    
    // Cleanup function to cancel pending requests when component unmounts
    return () => {
      // The cleanup will be handled by the closure in debouncedSearch
    };
  }, [searchTerm, debouncedSearch]);

  const getFilteredJobs = () => {
    if (activeFilter === 'vacant') return jobs.vacantJobs;
    if (activeFilter === 'engaged') return jobs.engagedJobs;
    return [...jobs.vacantJobs, ...jobs.engagedJobs];
  };

  const handleApply = (jobId) => {
    // // Implementation would depend on your application logic
    // console.log(`Applied for job: ${jobId}`);
    // // Here you would typically make an API call to apply for the job
    // axios.post(`/v1/application/jobs/${jobId}/apply`)
    //   .then(() => {
    //     alert(`Applied for job successfully!`);
    //   })
    //   .catch((error) => {
    //     console.error('Error applying for job:', error);
    //     alert('Failed to apply for job. Please try again.');
    //   });
    navigate(`/applyJob/${jobId}`);
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
  };

  const closeJobDetails = () => {
    setSelectedJob(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs, skills, or keywords..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          {/* <button className="mt-4 md:mt-0 flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-5 w-5 text-gray-500" />
            <span>Filters</span>
          </button> */}
        </div>

        {/* Filter Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All Jobs
          </span>
          <span
            onClick={() => setActiveFilter('vacant')}
            className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
              activeFilter === 'vacant'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Vacant
          </span>
          <span
            onClick={() => setActiveFilter('engaged')}
            className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
              activeFilter === 'engaged'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Engaged
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && getFilteredJobs().length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <SearchIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}

      {/* Job Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredJobs().map((job) => (
            <div key={job._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <span className={`inline-flex mt-2 px-2 py-1 text-xs font-medium rounded-full ${
                      job.status === 'vacant' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {job.status === 'vacant' ? 'Vacant' : 'Engaged'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">${(job.budget / 1000).toFixed(1)}k budget</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {job.description.split('\n')[0]}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button 
                    onClick={() => handleViewDetails(job)}
                    className="flex-1 py-2 px-4 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleApply(job._id)}
                    disabled={job.status !== 'vacant'}
                    className={`flex-1 py-2 px-4 rounded-lg ${
                      job.status === 'vacant'
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {job.status === 'vacant' ? 'Apply' : 'Engaged'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                <button 
                  onClick={closeJobDetails}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="flex items-center space-x-3 mb-6">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  selectedJob.status === 'vacant' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedJob.status === 'vacant' ? 'Vacant' : 'Engaged'}
                </span>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">${(selectedJob.budget / 1000).toFixed(1)}k budget</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">Deadline: {new Date(selectedJob.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <div className="text-gray-700 whitespace-pre-line">
                  {selectedJob.description}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={closeJobDetails}
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedJob.status === 'vacant' && (
                  <button 
                    onClick={() => {
                      handleApply(selectedJob._id);
                      closeJobDetails();
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Apply for Job
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearch;