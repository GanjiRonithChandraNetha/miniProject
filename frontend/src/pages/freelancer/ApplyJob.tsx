import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function JobApplicationPage() {
  const { jobId } = useParams(); // Get jobId from URL
  const navigate = useNavigate();
//   console.log(jobId);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    bidAmount: '',
    name: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    experience: '',
    skills: '',
    additionalInfo: ''
  });
  const [generatedData, setGeneratedData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Reset the form and states when jobId changes
    setLoading(true);
    setError(null);
    setGeneratedData(null);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    const fetchJobDetails = async () => {
      try {
        // console.log(jobId);
        const response = await axios.get(`http://localhost:3636/v1/application/viewJob/${jobId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("FreeToken")}`, // Example: Authorization header
                    'Content-Type': 'application/json',     // Example: Content-Type
                },
            }
        );
        // console.log(response.data.data);
        setJobDetails(response.data.data);
        console.log(jobDetails);
        // console.log(jobDetails.skills);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError(err.response?.data?.message || "Failed to load job details");
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    } else {
      setError("No job ID provided");
      setLoading(false);
    }
  }, [jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateCoverLetter = () => {
    const { name, phone, email, linkedin, github, experience, skills } = formData;
    
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return `${name}\n[Phone: ${phone}]\n[Email: ${email}]\n[LinkedIn: ${linkedin}]\n[GitHub: ${github}]\n\nDate: ${currentDate}\n\nHiring Manager\n${jobDetails?.company || '[Company Name]'}\n\nSubject: Application for ${jobDetails?.title || 'Job Position'}\n\nDear Hiring Manager,\n\nI am excited to apply for the ${jobDetails?.title || 'Job Position'} at ${jobDetails?.company || '[Company Name]'}. With a strong foundation in mobile and web development, coupled with my experience in integrating AI solutions, I am confident in my ability to contribute effectively to your team.\n\nDuring my career, I have ${experience}\n\nMy technical expertise includes:\n\n${skills}\n\nI am particularly drawn to this role because it aligns with my passion for designing intelligent chatbot solutions that enhance user interactions and streamline processes. My commitment to innovation and problem-solving makes me eager to bring value to your organization.\n\nThank you for considering my application. I look forward to discussing how I can contribute to your mission of delivering impactful AI-driven solutions.\n\nWarm regards,\n${name}\n[Phone: ${phone}] | [Email: ${email}]`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Generate cover letter based on form inputs
      const coverLetter = generateCoverLetter();
      
      // Create the application data structure
      const applicationData = {
        jobId,
        data: {
          bidAmount: parseInt(formData.bidAmount, 10),
          coverLetter
        }
      };

      // Set the generated data for preview
      setGeneratedData(applicationData);

      // Submit application to API
      await axios.post(`http://localhost:3636/v1/application/freelancer/application/create`, applicationData,
        {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("FreeToken")}`, // Example: Authorization header
              'Content-Type': 'application/json',     // Example: Content-Type
            },
          }
      );
      
      // Show success message
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Error submitting application:", err);
      setSubmitError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditApplication = () => {
    setGeneratedData(null);
    setSubmitSuccess(false);
  };

  const handleDownloadJSON = () => {
    if (!generatedData) return;
    
    const dataStr = JSON.stringify(generatedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.download = `job-application-${jobId}.json`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  };
  
  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/search')} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Job Application</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-lg">Loading job details...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Job Details Section */}
          <div className="md:col-span-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Job Details</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-600">{jobDetails.title}</h3>
              <p className="text-gray-700">{jobDetails.company}</p>
              <p className="text-gray-600">{jobDetails.location}</p>
              <p className="text-gray-600">Salary Range: {jobDetails.salary}</p>
              <p className="text-gray-500 text-sm">Posted: {jobDetails.postedDate}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Job Description</h4>
              <p className="text-gray-700">{jobDetails.description}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Requirements</h4>
              <ul className="list-disc pl-5 text-gray-700">
                {jobDetails.skills.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => navigate('/search')}
                className="w-full px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
              >
                Back to All Jobs
              </button>
            </div>
          </div>
          
          {/* Application Form */}
          <div className="md:col-span-2">
            {submitSuccess ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-bold mb-2">Application Submitted Successfully!</h2>
                  <p>Your application for {jobDetails.title} at {jobDetails.company} has been submitted.</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Application Data:</h3>
                  <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
                    {JSON.stringify(generatedData, null, 2)}
                  </pre>
                </div>
                
                <div className="flex justify-between mt-6">
                  <button 
                    onClick={() => navigate('/search')}
                    className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                  >
                    Browse More Jobs
                  </button>
                  <button 
                    onClick={handleDownloadJSON}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Download as JSON
                  </button>
                </div>
              </div>
            ) : generatedData ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Review Your Application</h2>
                  <button 
                    onClick={handleEditApplication}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    Edit Application
                  </button>
                </div>
                
                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
                    <p className="font-semibold">Error submitting application:</p>
                    <p>{submitError}</p>
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Application Data:</h3>
                  <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
                    {JSON.stringify(generatedData, null, 2)}
                  </pre>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button 
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-blue-400"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Confirm Submission'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-6">Apply for this Position</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <label className="block text-gray-700 mb-2">Bid Amount (₹)</label>
                    <input
                      type="number"
                      name="bidAmount"
                      value={formData.bidAmount}
                      onChange={handleInputChange}
                      placeholder="Your bid amount"
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label className="block text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label className="block text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your phone number"
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label className="block text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email address"
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label className="block text-gray-700 mb-2">LinkedIn Profile</label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="Your LinkedIn URL"
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label className="block text-gray-700 mb-2">GitHub Profile</label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      placeholder="Your GitHub URL"
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-gray-700 mb-2">Relevant Experience</label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="Describe your relevant experience"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    required
                  />
                </div>
                
                <div className="mt-6">
                  <label className="block text-gray-700 mb-2">Skills & Expertise</label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="List your technical skills and expertise"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    required
                  />
                </div>
                
                <div className="mt-6">
                  <label className="block text-gray-700 mb-2">Additional Information</label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    placeholder="Any additional information you'd like to share"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  />
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition disabled:bg-blue-400"
                    disabled={submitting}
                  >
                    {submitting ? 'Preparing Application...' : 'Review Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}