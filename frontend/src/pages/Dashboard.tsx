import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';

// Dummy data for testing
const dummyApplications = {
  rejected: [
    {
      freelancerId: "6804495d25a81b50f8baba88",
      applicationId: "68044a0825a81b50f8babaa1",
      applicationDetails: {
        _id: "68044a0825a81b50f8babaa1",
        bidAmount: 150000,
        coverLetter: "Raj Kumar\n[Phone: +91 9876543210]\n[Email: raj.kumar@example.com]\n[LinkedIn: https://www.linkedin.com/in/rajkumar/]\n[GitHub: https://github.com/rajkumar-dev]\n\nDate: April 10, 2025\n\nHiring Manager\n[Company Name]\n\nSubject: Application for Frontend Developer Position",
        status: "rejected",
        createdAt: "2025-04-10T01:12:40.942Z",
        updatedAt: "2025-04-10T06:01:38.210Z",
        __v: 0
      },
      jobId: "68028f99d39f68125952b38b"
    }
  ],
  draft: [
    {
      freelancerId: "6804495d25a81b50f8baba88",
      applicationId: "68044a0825a81b50f8babaa2",
      applicationDetails: {
        _id: "68044a0825a81b50f8babaa2",
        bidAmount: 180000,
        coverLetter: "Neha Singh\n[Phone: +91 9876543211]\n[Email: neha.singh@example.com]\n[LinkedIn: https://www.linkedin.com/in/nehasingh/]\n[GitHub: https://github.com/nehasingh-dev]\n\nDate: April 15, 2025\n\nHiring Manager\n[Company Name]\n\nSubject: Application for Backend Developer Position",
        status: "draft",
        createdAt: "2025-04-15T01:12:40.942Z",
        updatedAt: "2025-04-15T06:01:38.210Z",
        __v: 0
      },
      jobId: "68028f99d39f68125952b38c"
    },
    {
      freelancerId: "6804495d25a81b50f8baba88",
      applicationId: "68044a0825a81b50f8babaa3",
      applicationDetails: {
        _id: "68044a0825a81b50f8babaa3",
        bidAmount: 220000,
        coverLetter: "Ananya Patel\n[Phone: +91 9876543212]\n[Email: ananya.patel@example.com]\n[LinkedIn: https://www.linkedin.com/in/ananyapatel/]\n[GitHub: https://github.com/ananyapatel-dev]\n\nDate: April 16, 2025\n\nHiring Manager\n[Company Name]\n\nSubject: Application for Full Stack Developer Position",
        status: "draft",
        createdAt: "2025-04-16T01:12:40.942Z",
        updatedAt: "2025-04-16T06:01:38.210Z",
        __v: 0
      },
      jobId: "68028f99d39f68125952b38d"
    }
  ],
  appointed: [
    {
      freelancerId: "6804495d25a81b50f8baba88",
      applicationId: "68044a0825a81b50f8babaa4",
      applicationDetails: {
        _id: "68044a0825a81b50f8babaa4",
        bidAmount: 300000,
        coverLetter: "Vikram Joshi\n[Phone: +91 9876543213]\n[Email: vikram.joshi@example.com]\n[LinkedIn: https://www.linkedin.com/in/vikramjoshi/]\n[GitHub: https://github.com/vikramjoshi-dev]\n\nDate: April 5, 2025\n\nHiring Manager\n[Company Name]\n\nSubject: Application for DevOps Engineer Position",
        status: "appointed",
        createdAt: "2025-04-05T01:12:40.942Z",
        updatedAt: "2025-04-18T06:01:38.210Z",
        __v: 0
      },
      jobId: "68028f99d39f68125952b38e"
    }
  ],
  published: [
    {
      freelancerId: "6804495d25a81b50f8baba88",
      applicationId: "68044a0825a81b50f8babaa5",
      applicationDetails: {
        _id: "68044a0825a81b50f8babaa5",
        bidAmount: 270000,
        coverLetter: "Rahul Verma\n[Phone: +91 9876543214]\n[Email: rahul.verma@example.com]\n[LinkedIn: https://www.linkedin.com/in/rahulverma/]\n[GitHub: https://github.com/rahulverma-dev]\n\nDate: April 17, 2025\n\nHiring Manager\n[Company Name]\n\nSubject: Application for UI/UX Designer Position",
        status: "published",
        createdAt: "2025-04-17T01:12:40.942Z",
        updatedAt: "2025-04-17T06:01:38.210Z",
        __v: 0
      },
      jobId: "68028f99d39f68125952b38f"
    }
  ],
  selected: [
    {
      freelancerId: "6804495d25a81b50f8baba88",
      applicationId: "68044a0825a81b50f8babaad",
      applicationDetails: {
        _id: "68044a0825a81b50f8babaad",
        bidAmount: 250000,
        coverLetter: "Amit Verma\n[Phone: +91 9876532100]\n[Email: amit.verma@example.com]\n[LinkedIn: https://www.linkedin.com/in/amitverma/]\n[GitHub: https://github.com/amitverma-android]\n\nDate: April 13, 2025\n\nHiring Manager\n[Company Name]\n\nSubject: Application for AI-Powered Chatbot Developer Position",
        status: "selected",
        createdAt: "2025-04-20T01:12:40.942Z",
        updatedAt: "2025-04-20T06:01:38.210Z",
        __v: 0
      },
      jobId: "68028f99d39f68125952b38a"
    }
  ],
  ready: [
    {
      freelancerId: "6804495d25a81b50f8baba88",
      applicationId: "68044a0825a81b50f8babaa6",
      applicationDetails: {
        _id: "68044a0825a81b50f8babaa6",
        bidAmount: 280000,
        coverLetter: "Priya Sharma\n[Phone: +91 9876543215]\n[Email: priya.sharma@example.com]\n[LinkedIn: https://www.linkedin.com/in/priyasharma/]\n[GitHub: https://github.com/priyasharma-dev]\n\nDate: April 12, 2025\n\nHiring Manager\n[Company Name]\n\nSubject: Application for Mobile App Developer Position",
        status: "ready",
        createdAt: "2025-04-12T01:12:40.942Z",
        updatedAt: "2025-04-19T06:01:38.210Z",
        __v: 0
      },
      jobId: "68028f99d39f68125952b390"
    }
  ]
};

const dummyJobs = [
  {
    freelancerId: "68044a9d25a81b50f8babab4",
    jobId: "68028f99d39f68125952b38a",
    employerId: "68028c71d39f68125952b382",
    jobDetails: {
      "_id": "68028f99d39f68125952b38a",
      "title": "E-commerce Website Development",
      "description": "Job Title: E-commerce Web Developer (MERN Stack Preferred)\n\nJob Type: Full-Time / Contract / Freelance\n\nLocation: Remote / On-Site (Specify Location)\n\nSalary: Competitive, based on experience\n\nJob Overview: We are seeking a skilled E-commerce Web Developer to join our team. The ideal candidate will have experience building robust, scalable e-commerce platforms using the MERN stack (MongoDB, Express.js, React, Node.js). You will be responsible for both front-end and back-end development, ensuring seamless user experiences across devices.",
      "skills": [
        "MERN",
        "REST API",
        "Third-party Integrations",
        "Redux",
        "GraphQL",
        "Bootstrap",
        "Tailwind CSS",
        "Material-UI",
        "MongoDB",
        "MySQL",
        "AWS",
        "Firebase",
        "DigitalOcean",
        "Payment Gateway Integration",
        "Security Best Practices",
        "Problem-Solving",
        "Debugging",
        "Agile",
        "Git",
        "GitHub"
      ],
      "budget": 200000,
      "deadline": "2025-06-06T00:00:00.000Z",
      "status": "vacant",
      "createdAt": "2025-04-18T17:44:57.112Z",
      "__v": 0
    }
  },
  {
    freelancerId: "68044a9d25a81b50f8babab4",
    jobId: "68028f99d39f68125952b38b",
    employerId: "68028c71d39f68125952b383",
    jobDetails: {
      "_id": "68028f99d39f68125952b38b",
      "title": "Machine Learning Engineer",
      "description": "Job Title: Machine Learning Engineer\n\nJob Type: Full-Time / Contract\n\nLocation: Remote\n\nSalary: Competitive, based on experience\n\nJob Overview: We are looking for a Machine Learning Engineer to help us build and deploy ML models for our product. The ideal candidate should have strong experience with Python, TensorFlow/PyTorch, and deploying ML models in production environments.",
      "skills": [
        "Python",
        "TensorFlow",
        "PyTorch",
        "Scikit-learn",
        "Data Preprocessing",
        "Model Deployment",
        "Docker",
        "Kubernetes",
        "AWS",
        "GCP",
        "Computer Vision",
        "NLP",
        "Deep Learning",
        "Machine Learning Operations (MLOps)",
        "Git",
        "CI/CD"
      ],
      "budget": 300000,
      "deadline": "2025-05-15T00:00:00.000Z",
      "status": "vacant",
      "createdAt": "2025-04-10T14:22:37.112Z",
      "__v": 0
    }
  },
  {
    freelancerId: "68044a9d25a81b50f8babab4",
    jobId: "68028f99d39f68125952b38c",
    employerId: "68028c71d39f68125952b384",
    jobDetails: {
      "_id": "68028f99d39f68125952b38c",
      "title": "Mobile App Developer (React Native)",
      "description": "Job Title: Mobile App Developer (React Native)\n\nJob Type: Contract / Freelance\n\nLocation: Remote\n\nSalary: Based on experience\n\nJob Overview: We need an experienced React Native developer to build a cross-platform mobile application for our startup. The ideal candidate should have shipped multiple React Native apps to both iOS and Android stores and have strong UI/UX sensibilities.",
      "skills": [
        "React Native",
        "JavaScript",
        "TypeScript",
        "Redux",
        "API Integration",
        "Firebase",
        "Mobile UI/UX",
        "App Store Deployment",
        "Play Store Deployment",
        "Navigation",
        "State Management",
        "Native Modules",
        "Performance Optimization",
        "Offline Support",
        "Push Notifications",
        "Git"
      ],
      "budget": 180000,
      "deadline": "2025-07-01T00:00:00.000Z",
      "status": "vacant",
      "createdAt": "2025-04-15T09:33:21.112Z",
      "__v": 0
    }
  }
];

const Dashboard = () => {
  const [applications, setApplications] = useState(dummyApplications);
  const [jobs] = useState(dummyJobs);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [editingDraft, setEditingDraft] = useState(null);
  const [editForm, setEditForm] = useState({
    status: '',
    bidAmount: 0,
    coverLetter: ''
  });

  // Calculate stats based on the dummy data
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
        label: 'Available Jobs', 
        value: jobs.length.toString(), 
        icon: TrendingUp, 
        trend: 'Open opportunities' 
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

  const handleUpdateDraft = (applicationId) => {
    // Find the application in the draft category
    const updatedDrafts = applications.draft.map(app => {
      if (app.applicationId === applicationId) {
        // If status changed to published, move it to published category
        if (editForm.status === 'published') {
          // Add to published array
          applications.published.push({
            ...app,
            applicationDetails: {
              ...app.applicationDetails,
              ...editForm,
              status: 'published',
              updatedAt: new Date().toISOString()
            }
          });
          // Return null to filter out from drafts
          return null;
        } else {
          // Just update the draft
          return {
            ...app,
            applicationDetails: {
              ...app.applicationDetails,
              ...editForm,
              updatedAt: new Date().toISOString()
            }
          };
        }
      }
      return app;
    }).filter(Boolean); // Remove null entries

    setApplications({
      ...applications,
      draft: updatedDrafts
    });

    setEditingDraft(null);
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

  const confirmReadyStatus = () => {
    // Find and remove the application from selected category
    const updatedSelected = applications.selected.filter(
      app => app.applicationId !== selectedApplication.applicationId
    );

    // Add the application to ready category
    const readyApplication = {
      ...selectedApplication,
      applicationDetails: {
        ...selectedApplication.applicationDetails,
        status: 'ready',
        updatedAt: new Date().toISOString()
      }
    };

    setApplications({
      ...applications,
      selected: updatedSelected,
      ready: [...applications.ready, readyApplication]
    });
    
    setShowModal(false);
    setSelectedApplication(null);
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

  const renderJobSection = () => {
    if (jobs.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Available Jobs</h2>
          </div>
          <div className="p-6 text-gray-500 text-center">
            No jobs found.
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Available Jobs</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {jobs.map((job) => (
            <div key={job.jobId} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{job.jobDetails.title}</h3>
                  <p className="text-sm text-gray-500">Job ID: {job.jobId}</p>
                </div>
                <span className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                  {job.jobDetails.status}
                </span>
              </div>
              <div className="mt-4">
                <div className="font-medium text-gray-800">Description:</div>
                <div className="text-gray-600 mt-2 whitespace-pre-line max-h-40 overflow-y-auto">
                  {job.jobDetails.description.substring(0, 200)}
                  {job.jobDetails.description.length > 200 && '...'}
                </div>
              </div>
              <div className="mt-4">
                <div className="font-medium text-gray-800">Skills:</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.jobDetails.skills.slice(0, 5).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                  {job.jobDetails.skills.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      +{job.jobDetails.skills.length - 5} more
                    </span>
                  )}
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

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <span className="font-bold">Test Mode:</span> Using hardcoded dummy data. No API calls are being made.
            </p>
          </div>
        </div>
      </div>
      
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
        
        {/* Available Jobs Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Jobs</h2>
          {renderJobSection()}
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
    </div>
  );
};

export default Dashboard;