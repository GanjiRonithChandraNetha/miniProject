import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  Star, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Edit, 
  Save, 
  X, 
  AlertTriangle,
  FileText,
  Eye
} from 'lucide-react';

const Dashboard = () => {
  const [applications, setApplications] = useState({
    rejected: [],
    draft: [],
    appointed: [],
    published: [],
    selected: [],
    ready: []
  });
  
  const [appointedJobs, setAppointedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [editingDraft, setEditingDraft] = useState(null);
  const [editForm, setEditForm] = useState({
    status: '',
    bidAmount: 0,
    coverLetter: ''
  });
  const [showFullApplication, setShowFullApplication] = useState(null);
  const [viewingApplicationDetails, setViewingApplicationDetails] = useState(null);

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3636/v1/application/freelancer/application/read',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("FreeToken")}`, // Example: Authorization header
            'Content-Type': 'application/json',     // Example: Content-Type
          },
        }
      );
      console.log(response);
      setApplications(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load applications');
      setLoading(false);
      console.error(err);
    }
  };

  // Fetch appointed jobs
  const fetchAppointedJobs = async () => {
    try {
      setLoading(true);
      // Assume this endpoint exists
      const response = await axios.get('http://localhost:3636/v1/application/freelancer/job/read',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("FreeToken")}`, // Example: Authorization header
            'Content-Type': 'application/json',     // Example: Content-Type
          },
        }
      );
      
      // Handle empty array case
      const jobs = Array.isArray(response.data) ? response.data : [];
      setAppointedJobs(jobs);
      setLoading(false);
    } catch (err) {
      setError('Failed to load appointed jobs');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchAppointedJobs();
  }, []);

  // Calculate stats based on the fetched data
  const getStats = () => {
    const totalApplications = Object.values(applications).flat().length;
    const totalSelected = applications.selected.length;
    const totalPublished = applications.published.length;
    const totalDrafts = applications.draft.length;
    
    const stats = [
      { 
        label: 'Total Applications', 
        value: totalApplications.toString(), 
        icon: Briefcase, 
        trend: `${totalPublished} published` 
      },
      { 
        label: 'Selected Applications', 
        value: totalSelected.toString(), 
        icon: CheckCircle, 
        trend: 'Awaiting readiness' 
      },
      { 
        label: 'Draft Applications', 
        value: totalDrafts.toString(), 
        icon: FileText, 
        trend: 'Pending completion' 
      },
      { 
        label: 'Appointed Jobs', 
        value: appointedJobs.length.toString(), 
        icon: TrendingUp, 
        trend: 'Active jobs' 
      },
    ];

    return stats;
  };

  const handleEditDraft = (application) => {
    setEditingDraft(application.applicationId);
    setEditForm({
      status: application.applicationDetails.status,
      bidAmount: application.applicationDetails.bidAmount,
      coverLetter: application.applicationDetails.coverLetter
    });
  };

  const handleCancelEdit = () => {
    setEditingDraft(null);
    setEditForm({
      status: '',
      bidAmount: 0,
      coverLetter: ''
    });
  };

  const handleUpdateDraft = async (applicationId) => {
    try {
      if(editForm.status !== "published" && editForm.status !== "draft")
        alert(`can not change status to ${editForm.status}`);
      const updateData = {
        ...editForm
        // status: editForm.status === 'draft' ? 'published' : editForm.status
      };
      console.log(updateData);
      const res = await axios.put('http://localhost:3636/v1/application/freelancer/application/update', 
        {
          applicationId,
          data: updateData
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("FreeToken")}`, // Example: Authorization header
            'Content-Type': 'application/json',     // Example: Content-Type
          },
        }
      );
      console.log(res);
      // Refresh data after update
      fetchApplications();
      setEditingDraft(null);
    } catch (err) {
      setError('Failed to update application');
      console.error(err);
    }
  };

  const handleStatusChange = (e) => {
    setEditForm({
      ...editForm,
      status: e.target.value
    });
  };

  const initiateReadyProcess = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const confirmReadyStatus = async () => {
    try {
      await axios.post('http://localhost:3636/v1/application/freelancer/application/update', {
        applicationId: selectedApplication.applicationId,
        data: {
          status: 'ready'
        }
      });
      
      setShowModal(false);
      setSelectedApplication(null);
      // Refresh data after update
      fetchApplications();
    } catch (err) {
      setError('Failed to update status to ready');
      console.error(err);
    }
  };
  
  const handleViewApplication = (jobId) => {
    setShowFullApplication(jobId);
  };
  
  const handleCloseFullView = () => {
    setShowFullApplication(null);
  };
  
  const handleViewApplicationDetails = (application) => {
    setViewingApplicationDetails(application);
  };
  
  const handleCloseApplicationDetails = () => {
    setViewingApplicationDetails(null);
  };

  const renderApplicationSection = (title, applications, type) => {
    if (applications.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
          <div className="p-6 text-gray-500 text-center">
            No {type} applications found.
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {applications.map((application) => (
            <div key={application.applicationId} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    Job ID: {application.jobId}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Application ID: {application.applicationId}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {type === 'draft' && (
                    <div>
                      {editingDraft === application.applicationId ? (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleUpdateDraft(application.applicationId)} 
                            className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
                          >
                            <Save className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={handleCancelEdit} 
                            className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleEditDraft(application)} 
                          className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  )}

                  {type === 'selected' && (
                    <button 
                      onClick={() => initiateReadyProcess(application)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Mark as Ready
                    </button>
                  )}
                  
                  {/* View Details button for all application types */}
                  <button 
                    onClick={() => handleViewApplicationDetails(application)}
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                </div>
              </div>

              {editingDraft === application.applicationId ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={editForm.status}
                      onChange={handleStatusChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bid Amount</label>
                    <input
                      type="number"
                      value={editForm.bidAmount}
                      onChange={(e) => setEditForm({...editForm, bidAmount: parseInt(e.target.value)})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                    <textarea
                      value={editForm.coverLetter}
                      onChange={(e) => setEditForm({...editForm, coverLetter: e.target.value})}
                      rows={6}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mt-4">
                    <div className="font-medium text-gray-800">Bid Amount:</div>
                    <div className="text-gray-600">
                      ₹{application.applicationDetails.bidAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="font-medium text-gray-800">Cover Letter:</div>
                    <div className="text-gray-600 mt-2 whitespace-pre-line max-h-40 overflow-y-auto">
                      {application.applicationDetails.coverLetter.substring(0, 200)}
                      {application.applicationDetails.coverLetter.length > 200 && '...'}
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    Created: {new Date(application.applicationDetails.createdAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAppointedJobsSection = () => {
    if (!appointedJobs || appointedJobs.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Appointed Jobs</h2>
          </div>
          <div className="p-6 text-gray-500 text-center">
            No appointed jobs found.
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Appointed Jobs</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {appointedJobs.map((job) => (
            <div key={job.jobId} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{job.jobDetails.title}</h3>
                  <p className="text-sm text-gray-500">Job ID: {job.jobId}</p>
                </div>
                <div className="flex space-x-3 items-center">
                  <span className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                    {job.jobDetails.status}
                  </span>
                  <button 
                    onClick={() => handleViewApplication(job.jobId)}
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="font-medium text-gray-800">Description:</div>
                <div className="text-gray-600 mt-2 whitespace-pre-line max-h-40 overflow-y-auto">
                  {job.jobDetails.description.substring(0, 200)}
                  {job.jobDetails.description.length > 200 && '...'}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="font-medium text-gray-800">Budget:</div>
                  <div className="text-gray-600">₹{job.jobDetails.budget.toLocaleString()}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Deadline:</div>
                  <div className="text-gray-600">
                    {new Date(job.jobDetails.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto" />
          <p className="mt-4 text-gray-700">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              fetchApplications();
              fetchAppointedJobs();
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900">Freelancer Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStats().map((stat) => {
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
      <div className="grid grid-cols-1 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Management</h2>
          
          {/* Selected Applications - Priority section */}
          {applications.selected.length > 0 && (
            renderApplicationSection('Selected Applications', applications.selected, 'selected')
          )}
          
          {/* Draft Applications */}
          {renderApplicationSection('Draft Applications', applications.draft, 'draft')}
          
          {/* Published Applications */}
          {renderApplicationSection('Published Applications', applications.published, 'published')}
          
          {/* Appointed Applications */}
          {renderApplicationSection('Appointed Applications', applications.appointed, 'appointed')}
          
          {/* Ready Applications */}
          {renderApplicationSection('Ready Applications', applications.ready, 'ready')}
          
          {/* Rejected Applications */}
          {renderApplicationSection('Rejected Applications', applications.rejected, 'rejected')}
        </div>
        
        {/* Appointed Jobs Section (Formerly Available Jobs) */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Appointed Jobs</h2>
          {renderAppointedJobsSection()}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Status Change</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark this application as "Ready"? This action cannot be reversed.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={confirmReadyStatus} 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Application View Modal */}
      {showFullApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Complete Job Details</h3>
              <button 
                onClick={handleCloseFullView}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {appointedJobs.find(job => job.jobId === showFullApplication) && (
              <div className="space-y-6">
                {(() => {
                  const job = appointedJobs.find(job => job.jobId === showFullApplication);
                  return (
                    <>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{job.jobDetails.title}</h4>
                        <p className="text-sm text-gray-500">Job ID: {job.jobId}</p>
                        <span className="mt-2 inline-block px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                          {job.jobDetails.status}
                        </span>
                      </div>

                      <div>
                        <div className="font-medium text-gray-800 mb-2">Full Description:</div>
                        <div className="p-4 bg-gray-50 rounded-md text-gray-600 whitespace-pre-line">
                          {job.jobDetails.description}
                        </div>
                      </div>

                      <div>
                        <div className="font-medium text-gray-800 mb-2">Skills Required:</div>
                        <div className="flex flex-wrap gap-2">
                          {job.jobDetails.skills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="font-medium text-gray-800 mb-2">Budget:</div>
                          <div className="text-gray-600">₹{job.jobDetails.budget.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 mb-2">Deadline:</div>
                          <div className="text-gray-600">
                            {new Date(job.jobDetails.deadline).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {job.jobDetails.attachments && job.jobDetails.attachments.length > 0 && (
                        <div>
                          <div className="font-medium text-gray-800 mb-2">Attachments:</div>
                          <div className="space-y-2">
                            {job.jobDetails.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                                <FileText className="h-5 w-5 text-gray-500 mr-2" />
                                <span className="text-gray-600">{attachment.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="font-medium text-gray-800 mb-2">Client Information:</div>
                        <div className="p-4 bg-gray-50 rounded-md">
                          {job.jobDetails.clientName && (
                            <div className="mb-2">
                              <span className="text-gray-700 font-medium">Name: </span>
                              <span className="text-gray-600">{job.jobDetails.clientName}</span>
                            </div>
                          )}
                          {job.jobDetails.clientContact && (
                            <div>
                              <span className="text-gray-700 font-medium">Contact: </span>
                              <span className="text-gray-600">{job.jobDetails.clientContact}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Application Details Modal */}
      {viewingApplicationDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Complete Application Details</h3>
              <button 
                onClick={handleCloseApplicationDetails}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Application ID: {viewingApplicationDetails.applicationId}</h4>
                  <p className="text-sm text-gray-500">Job ID: {viewingApplicationDetails.jobId}</p>
                </div>
                <span className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                  {viewingApplicationDetails.applicationDetails.status}
                </span>
              </div>
              
              <div>
                <div className="font-medium text-gray-800 mb-2">Application Date:</div>
                <div className="text-gray-600">
                  {new Date(viewingApplicationDetails.applicationDetails.createdAt).toLocaleString()}
                </div>
              </div>
              
              {viewingApplicationDetails.applicationDetails.updatedAt && (
                <div>
                  <div className="font-medium text-gray-800 mb-2">Last Updated:</div>
                  <div className="text-gray-600">
                    {new Date(viewingApplicationDetails.applicationDetails.updatedAt).toLocaleString()}
                  </div>
                </div>
              )}
              
              <div>
                <div className="font-medium text-gray-800 mb-2">Bid Amount:</div>
                <div className="text-gray-600">
                  ₹{viewingApplicationDetails.applicationDetails.bidAmount.toLocaleString()}
                </div>
              </div>
              
              <div>
                <div className="font-medium text-gray-800 mb-2">Full Cover Letter:</div>
                <div className="p-4 bg-gray-50 rounded-md text-gray-600 whitespace-pre-line">
                  {viewingApplicationDetails.applicationDetails.coverLetter}
                </div>
              </div>
              
              {viewingApplicationDetails.applicationDetails.skills && viewingApplicationDetails.applicationDetails.skills.length > 0 && (
                <div>
                  <div className="font-medium text-gray-800 mb-2">Skills Highlighted:</div>
                  <div className="flex flex-wrap gap-2">
                    {viewingApplicationDetails.applicationDetails.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {viewingApplicationDetails.applicationDetails.attachments && viewingApplicationDetails.applicationDetails.attachments.length > 0 && (
                <div>
                  <div className="font-medium text-gray-800 mb-2">Attachments:</div>
                  <div className="space-y-2">
                    {viewingApplicationDetails.applicationDetails.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                        <FileText className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-gray-600">{attachment.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {viewingApplicationDetails.applicationDetails.notes && (
                <div>
                  <div className="font-medium text-gray-800 mb-2">Additional Notes:</div>
                  <div className="p-4 bg-gray-50 rounded-md text-gray-600 whitespace-pre-line">
                    {viewingApplicationDetails.applicationDetails.notes}
                  </div>
                </div>
              )}
              
              {viewingApplicationDetails.applicationDetails.status === 'rejected' && viewingApplicationDetails.applicationDetails.rejectionReason && (
                <div>
                  <div className="font-medium text-red-800 mb-2">Rejection Reason:</div>
                  <div className="p-4 bg-red-50 rounded-md text-red-600 whitespace-pre-line">
                    {viewingApplicationDetails.applicationDetails.rejectionReason}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
