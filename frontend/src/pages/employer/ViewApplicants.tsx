import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Types
interface Link {
  key: string;
  value: string;
}

interface UserDetail {
  username: string[];
  email: string[];
  profilePic: string[];
}

interface ApplicationDetails {
  bidAmount: number;
  coverLetter: string;
  status: string;
}

interface Applicant {
  _id: string;
  applicationId: string;
  jobId: string;
  applicationDetails: ApplicationDetails;
  userDetails: UserDetail[];
  userSkills: string[][];
  links: Link[];
}

interface UserSkill {
  _id: string;
  skill: string;
}

interface UserLink {
  _id: string;
  [key: string]: string;
}

interface UserProfile {
  username: string;
  email: string;
  profile: Record<string, any>;
  skills: UserSkill[];
  links: UserLink[];
}

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.yourservice.com';

const ApplicantsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [currentApplicant, setCurrentApplicant] = useState<Applicant | null>(null);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [agreementLoading, setAgreementLoading] = useState<boolean>(false);

  // Fetch applicants on component mount
  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  // Fetch applicants from API
  const fetchApplicants = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`http://localhost:3636/v1/application/employer/job/read/applicants`,
        {jobId:jobId},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("FreeToken")}`, // Example: Authorization header
            'Content-Type': 'application/json',     // Example: Content-Type
          },
        }
      );
      setApplicants(response.data);
    } catch (err) {
      console.error('Error fetching applicants:', err);
      setError('Failed to load applicants. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to get first paragraph from cover letter as a preview
  const getCoverLetterPreview = (coverLetter: string): string => {
    const paragraphs = coverLetter.split('\n\n');
    // Skip header info and get to the actual content
    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].length > 50 && !paragraphs[i].includes('Date:') && !paragraphs[i].includes('Subject:')) {
        return paragraphs[i].substring(0, 150) + '...';
      }
    }
    return coverLetter.substring(0, 150) + '...';
  };

  // Format links with proper icons
  const renderLinks = (links: Link[]) => {
    return (
      <div className="flex space-x-3 mt-2">
        {links.map((link) => {
          let icon;
          switch (link.key) {
            case 'linkedIn':
              icon = <i className="fab fa-linkedin text-blue-600"></i>;
              break;
            case 'github':
              icon = <i className="fab fa-github text-gray-800"></i>;
              break;
            case 'instagram':
              icon = <i className="fab fa-instagram text-pink-600"></i>;
              break;
            case 'project':
              icon = <i className="fas fa-globe text-green-600"></i>;
              break;
            default:
              icon = <i className="fas fa-link text-gray-600"></i>;
          }
          
          return (
            <a
              key={link.key}
              href={link.value}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700"
            >
              {icon}
            </a>
          );
        })}
      </div>
    );
  };

  // Handle applicant selection for agreement
  const toggleApplicantSelection = (applicantId: string) => {
    if (selectedApplicants.includes(applicantId)) {
      setSelectedApplicants(selectedApplicants.filter(id => id !== applicantId));
    } else {
      setSelectedApplicants([...selectedApplicants, applicantId]);
    }
  };

  // View full application 
  const handleViewApplication = (applicant: Applicant) => {
    setCurrentApplicant(applicant);
    setViewModalOpen(true);
  };

  // Get freelancer profile from API
  const handleGetProfile = async (username: string) => {
    setProfileLoading(true);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/profile/${username}`);
      setCurrentProfile(response.data);
      setProfileModalOpen(true);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      alert('Failed to load user profile. Please try again later.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Send agreement to selected applicants through API
  const handleSendAgreement = async () => {
    if (selectedApplicants.length === 0) {
      alert('Please select at least one applicant');
      return;
    }

    setAgreementLoading(true);
    
    console.log(selectedApplicants);

    try {
      await axios.post(`http://localhost:3636/v1/application/employer/job/read/send-agreement`, {
          selected: selectedApplicants,
          jobId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("FreeToken")}`, // Example: Authorization header
            'Content-Type': 'application/json',     // Example: Content-Type
          },
        }
      );
      
      // Update local state to reflect status change
      const updatedApplicants = applicants.map(applicant => {
        if (selectedApplicants.includes(applicant.applicationId)) {
          return {
            ...applicant,
            applicationDetails: {
              ...applicant.applicationDetails,
              status: 'agreement_sent'
            }
          };
        }
        return applicant;
      });
      
      setApplicants(updatedApplicants);
      setSelectedApplicants([]);
      alert('Agreement sent successfully!');
    } catch (err) {
      console.error('Error sending agreements:', err);
      alert('Failed to send agreements. Please try again later.');
    } finally {
      setAgreementLoading(false);
    }
  };

  // Modal for viewing full application
  const ViewApplicationModal = () => {
    if (!currentApplicant) return null;
    
    const coverLetterLines = currentApplicant.applicationDetails.coverLetter.split('\n');
    const name = coverLetterLines[0] || 'Unknown';
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-screen overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{name}'s Application</h2>
            <button 
              onClick={() => setViewModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times">✕</i>
            </button>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Application Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentApplicant.applicationDetails.status === 'draft' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : currentApplicant.applicationDetails.status === 'submitted'
                    ? 'bg-green-100 text-green-800'
                    : currentApplicant.applicationDetails.status === 'agreement_sent'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {currentApplicant.applicationDetails.status.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Bid Amount:</span>
                <span>₹{currentApplicant.applicationDetails.bidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Applied On:</span>
                <span>{new Date().toLocaleDateString()}</span> {/* Ideally, get this from API */}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Cover Letter</h3>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
              {currentApplicant.applicationDetails.coverLetter}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {currentApplicant.userSkills[0]?.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentApplicant.links.map((link, index) => (
                <a 
                  key={index}
                  href={link.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  {link.key === 'linkedIn' && <span>LinkedIn:</span>}
                  {link.key === 'github' && <span>GitHub:</span>}
                  {link.key === 'instagram' && <span>Instagram:</span>}
                  {link.key === 'project' && <span>Portfolio:</span>}
                  {link.value}
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setViewModalOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal for viewing user profile
  const ProfileModal = () => {
    if (!currentProfile) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-screen overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{currentProfile.username}'s Profile</h2>
            <button 
              onClick={() => setProfileModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times">✕</i>
            </button>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Contact Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-envelope text-gray-500">✉️</i>
                <span>{currentProfile.email}</span>
              </div>
              {/* Add more contact details if available in profile */}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {currentProfile.skills.map((skillObj) => (
                <span 
                  key={skillObj._id} 
                  className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                >
                  {skillObj.skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentProfile.links.map((linkObj) => {
                // Extract link key and value
                const key = Object.keys(linkObj).find(k => k !== '_id') || '';
                const value = linkObj[key];
                
                if (!value || key === '_id') return null;
                
                return (
                  <a 
                    key={linkObj._id}
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    {key === 'linkedIn' && <span>LinkedIn:</span>}
                    {key === 'github' && <span>GitHub:</span>}
                    {key === 'instagram' && <span>Instagram:</span>}
                    {key === 'project' && <span>Portfolio:</span>}
                    {value}
                  </a>
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setProfileModalOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-lg">{error}</p>
        <button 
          onClick={fetchApplicants}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Applicants for Job ID: {jobId}</h1>
          <p className="text-gray-600">{applicants.length} applicants found</p>
        </div>
        
        <button 
          onClick={handleSendAgreement}
          disabled={selectedApplicants.length === 0 || agreementLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded text-white font-medium ${
            selectedApplicants.length === 0 || agreementLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {agreementLoading ? (
            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white">⟳</span>
          ) : (
            <i className="fas fa-paper-plane">📄</i>
          )}
          Send Agreement ({selectedApplicants.length})
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applicants.map((applicant) => {
          const username = applicant.userDetails[0]?.username[0] || 'Unknown';
          const email = applicant.userDetails[0]?.email[0] || 'No email provided';
          const skills = applicant.userSkills[0] || [];
          
          // Extract name from cover letter
          const coverLetterLines = applicant.applicationDetails.coverLetter.split('\n');
          const name = coverLetterLines[0] || username;
          
          return (
            <div 
              key={applicant._id} 
              className={`bg-white rounded-lg shadow-md overflow-hidden border ${
                selectedApplicants.includes(applicant.applicationId)
                  ? 'border-blue-500 ring-2 ring-blue-300'
                  : 'border-gray-200'
              } hover:shadow-lg transition-shadow`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      checked={selectedApplicants.includes(applicant.applicationId)}
                      onChange={() => toggleApplicantSelection(applicant.applicationId)}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                      <p className="text-gray-600 text-sm">{email}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    applicant.applicationDetails.status === 'draft' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : applicant.applicationDetails.status === 'submitted'
                      ? 'bg-green-100 text-green-800'
                      : applicant.applicationDetails.status === 'agreement_sent'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {applicant.applicationDetails.status.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="font-medium mr-2">Bid Amount:</span>
                    <span>₹{applicant.applicationDetails.bidAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Cover Letter Preview</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {getCoverLetterPreview(applicant.applicationDetails.coverLetter)}
                    </p>
                  </div>
                  
                  {renderLinks(applicant.links)}
                </div>
                
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleGetProfile(username)}
                    disabled={profileLoading}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                  >
                    {profileLoading ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600">⟳</span>
                    ) : (
                      <i className="fas fa-user">👤</i>
                    )}
                    View Profile
                  </button>
                  
                  <button
                    onClick={() => handleViewApplication(applicant)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                  >
                    <i className="fas fa-eye">👁️</i>
                    View Full Application
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Render no applicants message if list is empty */}
      {applicants.length === 0 && !loading && (
        <div className="py-12 text-center">
          <p className="text-xl text-gray-500">No applicants found for this job.</p>
        </div>
      )}
      
      {/* Modals */}
      {viewModalOpen && <ViewApplicationModal />}
      {profileModalOpen && <ProfileModal />}
    </div>
  );
};

export default ApplicantsPage;