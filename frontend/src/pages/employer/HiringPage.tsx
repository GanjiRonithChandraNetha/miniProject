import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Define TypeScript interfaces for our data
interface Link {
  key: string;
  value: string;
}

interface Applicant {
  _id: string;
  applicationId: string;
  jobId: string;
  links: Link[];
  bidAmount: number;
  coverLetter: string;
  userName: string;
  email: string;
  skills?: string[];
  status?: string;
  appliedOn?: string;
}

interface UserProfile {
  username: string;
  email: string;
  profile?: Record<string, any>;
  skills: { _id: string; skill: string }[];
  links: { _id: string; [key: string]: string }[];
}

interface ApiResponse {
  agreedApplicants: Applicant[];
  success?: boolean;
}

const AgreedFreelancers: React.FC = () => {
  const [agreedApplicants, setAgreedApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appointedFreelancer, setAppointedFreelancer] = useState<string | null>(null);
  const [isAppointingInProgress, setIsAppointingInProgress] = useState<boolean>(false);
  
  // View Modal States
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [currentApplicant, setCurrentApplicant] = useState<Applicant | null>(null);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  
  // Replace Next.js router with React Router
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();

  useEffect(() => {
    // Only fetch data when jobId is available
    if (jobId) {
      fetchAgreedApplicants();
    }
  }, [jobId]);

  const fetchAgreedApplicants = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.post<ApiResponse>('http://localhost:3636/v1/application/employer/job/read/agreed', {
        jobId: jobId
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("FreeToken")}`, // Example: Authorization header
          'Content-Type': 'application/json',     // Example: Content-Type
        },
      }
    );
      
      setAgreedApplicants(response.data.agreedApplicants || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch agreed applicants. Please try again later.');
      setLoading(false);
    }
  };

  const appointFreelancer = async (applicationId: string): Promise<void> => {
    try {
      setIsAppointingInProgress(true);
      const response = await axios.post<ApiResponse>('http://localhost:3636/v1/application/employer/job/read/provied-project', {
            jobId: jobId,
            applicationId: applicationId
        },
        {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("FreeToken")}`, // Example: Authorization header
              'Content-Type': 'application/json',     // Example: Content-Type
            },
        }
    );
      console.log(response);
      if (response.data.success) {
        setAppointedFreelancer(applicationId);
        alert('Freelancer appointed successfully!');
      } else {
        alert('Failed to appoint freelancer. Please try again.');
      }
      setIsAppointingInProgress(false);
    } catch (err) {
      alert('Error appointing freelancer. Please try again later.');
      setIsAppointingInProgress(false);
    }
  };

  const viewCompleteProfile = (userName: string): void => {
    // First try to fetch profile data
    fetchUserProfile(userName);
  };

  const viewCompleteApplication = (applicant: Applicant): void => {
    // Set current applicant and open modal
    setCurrentApplicant(applicant);
    setViewModalOpen(true);
  };

  // Get freelancer profile from API
  const fetchUserProfile = async (username: string) => {
    setProfileLoading(true);
    
    try {
      // Mock API call for now - in production, this would be a real endpoint
      // const response = await axios.get(`${API_BASE_URL}/api/users/profile/${username}`);
      
      // For demo purposes, create a mock profile
      const mockProfile: UserProfile = {
        username: username,
        email: agreedApplicants.find(a => a.userName === username)?.email || 'email@example.com',
        skills: [
          { _id: '1', skill: 'React' },
          { _id: '2', skill: 'TypeScript' },
          { _id: '3', skill: 'Node.js' }
        ],
        links: agreedApplicants
          .find(a => a.userName === username)?.links
          .map((link, idx) => ({ 
            _id: `link-${idx}`, 
            [link.key]: link.value 
          })) || []
      };
      
      setCurrentProfile(mockProfile);
      setProfileModalOpen(true);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      alert('Failed to load user profile. Please try again later.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Modal for viewing full application
  const ViewApplicationModal = () => {
    if (!currentApplicant) return null;
    
    const coverLetterLines = currentApplicant.coverLetter.split('\n');
    const name = coverLetterLines[0] || currentApplicant.userName || 'Unknown';
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-screen overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{name}'s Application</h2>
            <button 
              onClick={() => setViewModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="text-xl font-bold">×</span>
            </button>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Application Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Status:</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Agreed
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Bid Amount:</span>
                <span>₹{currentApplicant.bidAmount.toLocaleString()}</span>
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
              {currentApplicant.coverLetter}
            </div>
          </div>
          
          {currentApplicant.skills && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {currentApplicant.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
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
            {!appointedFreelancer && (
              <button 
                onClick={() => {
                  appointFreelancer(currentApplicant.applicationId);
                  setViewModalOpen(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded"
              >
                Appoint Freelancer
              </button>
            )}
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
              <span className="text-xl font-bold">×</span>
            </button>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Contact Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-500">✉️</span>
                <span>{currentProfile.email}</span>
              </div>
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
            {!appointedFreelancer && currentApplicant && (
              <button 
                onClick={() => {
                  appointFreelancer(currentApplicant.applicationId);
                  setProfileModalOpen(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded"
              >
                Appoint Freelancer
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="text-center py-20">Loading agreed freelancers...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
  if (!agreedApplicants.length) return <div className="text-center py-20">No agreed freelancers found for this job.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Agreed Freelancers</h1>
      <p className="mb-4">Select a freelancer to appoint for your project. You can only appoint one freelancer.</p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agreedApplicants.map((applicant) => (
          <div 
            key={applicant.applicationId} 
            className={`border rounded-lg p-6 bg-white shadow-md ${
              appointedFreelancer === applicant.applicationId ? 'border-green-500 ring-2 ring-green-300' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{applicant.userName}</h2>
                <p className="text-gray-600">{applicant.email}</p>
              </div>
              {appointedFreelancer === applicant.applicationId && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Appointed</span>
              )}
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Bid Amount</h3>
              <p className="text-lg font-semibold">₹{(applicant.bidAmount / 1000).toFixed(1)}K</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Links</h3>
              {applicant.links && applicant.links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {applicant.links.map((link, index) => (
                    <a 
                      key={index} 
                      href={link.value} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
                    >
                      {link.key}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                onClick={() => viewCompleteApplication(applicant)}
              >
                View Complete Application
              </button>
              
              <button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
                onClick={() => viewCompleteProfile(applicant.userName)}
                disabled={profileLoading}
              >
                {profileLoading ? 'Loading Profile...' : 'View Profile'}
              </button>
              
              <button 
                className={`py-2 px-4 rounded ${
                  appointedFreelancer 
                    ? 'bg-gray-300 cursor-not-allowed text-gray-700' 
                    : isAppointingInProgress
                      ? 'bg-yellow-500 cursor-wait text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                onClick={() => !appointedFreelancer && !isAppointingInProgress && appointFreelancer(applicant.applicationId)}
                disabled={appointedFreelancer !== null || isAppointingInProgress}
              >
                {isAppointingInProgress ? 'Appointing...' : appointedFreelancer === applicant.applicationId ? 'Appointed' : 'Appoint Freelancer'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Render Modals */}
      {viewModalOpen && <ViewApplicationModal />}
      {profileModalOpen && <ProfileModal />}
    </div>
  );
};

export default AgreedFreelancers;