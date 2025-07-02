import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, LinkIcon, Mail, Edit2, Plus, X, Save, Loader } from 'lucide-react';

const Profile = () => {
  // State for user data
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit states
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  
  // Image upload states
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);
  
  // New skill and link states
  const [newSkill, setNewSkill] = useState('');
  const [newLinkPlatform, setNewLinkPlatform] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  
  // Loading states for different API calls
  const [updatingSkills, setUpdatingSkills] = useState(false);
  const [updatingLinks, setUpdatingLinks] = useState(false);

  // API base URL
  const API_BASE_URL = 'http://localhost:3636/v1/application';

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("FreeToken")}`,
            'Content-Type': 'application/json',
          },
        });
        console.log("Profile data:", response.data);
        setUserData(response.data);
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Format username for display
  const formatUsername = (name) => {
    return name ? name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') : "User";
  };

  // Format skills for display
  const formatSkill = (skill) => {
    return skill
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Handle adding a new skill
  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    
    try {
      setUpdatingSkills(true);
      const response = await axios.post(`${API_BASE_URL}/profile/update/skill`, {
        type: "INSERT",
        skill: newSkill.toLowerCase().trim()
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("FreeToken")}`,
          'Content-Type': 'application/json',
        },
      });
      
      setUserData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), response.data]
      }));
      
      setNewSkill('');
    } catch (err) {
      console.error('Failed to add skill:', err);
      alert('Failed to add skill');
    } finally {
      setUpdatingSkills(false);
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = async (skillId) => {
    try {
      setUpdatingSkills(true);
      await axios.post(`${API_BASE_URL}/profile/update/skill`, {
        type: "DELETE",
        skillId: skillId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("FreeToken")}`,
          'Content-Type': 'application/json',
        },
      });
      
      setUserData(prev => ({
        ...prev,
        skills: prev.skills.filter(skill => skill._id !== skillId)
      }));
    } catch (err) {
      console.error('Failed to remove skill:', err);
      alert('Failed to remove skill');
    } finally {
      setUpdatingSkills(false);
    }
  };

  // Handle adding a new link
  const handleAddLink = async () => {
    if (!newLinkPlatform.trim() || !newLinkUrl.trim()) return;
    
    try {
      setUpdatingLinks(true);
      const response = await axios.post(`${API_BASE_URL}/profile/update/link`, {
        type: "INSERT",
        linkKey: newLinkPlatform.trim(),
        linkValue: newLinkUrl.trim()
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("FreeToken")}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Update links in state - adjust according to your API response format
      setUserData(prev => {
        const newLinks = { ...(prev.links || {}) };
        if (!Array.isArray(newLinks)) {
          newLinks[response.data._id] = {
            platform: newLinkPlatform.trim(),
            url: newLinkUrl.trim()
          };
        }
        return {
          ...prev,
          links: newLinks
        };
      });
      
      setNewLinkPlatform('');
      setNewLinkUrl('');
    } catch (err) {
      console.error('Failed to add link:', err);
      alert('Failed to add link');
    } finally {
      setUpdatingLinks(false);
    }
  };

  // Handle removing a link
  const handleRemoveLink = async (linkId) => {
    try {
      setUpdatingLinks(true);
      await axios.post(`${API_BASE_URL}/profile/update/link`, {
        type: "DELETE",
        linkId: linkId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("FreeToken")}`,
          'Content-Type': 'application/json',
        },
      });
      
      setUserData(prev => {
        const updatedLinks = { ...prev.links };
        delete updatedLinks[linkId];
        return {
          ...prev,
          links: updatedLinks
        };
      });
    } catch (err) {
      console.error('Failed to remove link:', err);
      alert('Failed to remove link');
    } finally {
      setUpdatingLinks(false);
    }
  };

  // Handle profile image upload
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      setUploadingProfileImage(true);
      const response = await axios.post(`${API_BASE_URL}/profile/upload/profileimage`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("FreeToken")}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUserData(prev => ({
        ...prev,
        profileImage: response.data.imageUrl
      }));
    } catch (err) {
      console.error('Failed to upload profile image:', err);
      alert('Failed to upload profile image');
    } finally {
      setUploadingProfileImage(false);
    }
  };

  // Handle cover image upload
  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      setUploadingCoverImage(true);
      const response = await axios.post(`${API_BASE_URL}/profile/upload/coverimage`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("FreeToken")}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUserData(prev => ({
        ...prev,
        coverImage: response.data.imageUrl
      }));
    } catch (err) {
      console.error('Failed to upload cover image:', err);
      alert('Failed to upload cover image');
    } finally {
      setUploadingCoverImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const { username, email, skills = [], links = {} } = userData || {};

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          {userData?.coverImage && (
            <img 
              src={userData.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          )}
          <label className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg cursor-pointer">
            {uploadingCoverImage ? (
              <Loader className="h-5 w-5 text-gray-600 animate-spin" />
            ) : (
              <>
                <Camera className="h-5 w-5 text-gray-600" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                />
              </>
            )}
          </label>
        </div>

        {/* Profile Info */}
        <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5">
            <div className="-mt-16 relative">
              <img
                src={userData?.profileImage || "/api/placeholder/256/256"}
                alt="Profile"
                className="h-32 w-32 rounded-full ring-4 ring-white bg-white object-cover"
              />
              <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-lg cursor-pointer">
                {uploadingProfileImage ? (
                  <Loader className="h-4 w-4 text-gray-600 animate-spin" />
                ) : (
                  <>
                    <Camera className="h-4 w-4 text-gray-600" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                    />
                  </>
                )}
              </label>
            </div>
            
            <div className="mt-6 sm:mt-0 sm:flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{formatUsername(username)}</h1>
              </div>
              <p className="mt-1 text-gray-500">
                {skills.length > 0 ? formatSkill(skills[0].skill) : "Developer"}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-center space-x-2 text-gray-500">
              <Mail className="h-5 w-5" />
              <span>{email}</span>
            </div>
            
            {/* Links Section */}
            <div className="col-span-1 sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-md font-medium text-gray-900">Links</h3>
                <button 
                  onClick={() => setIsEditingLinks(!isEditingLinks)}
                  className="text-indigo-600 hover:text-indigo-500 flex items-center text-sm"
                >
                  {isEditingLinks ? 'Done' : (
                    <>
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit Links
                    </>
                  )}
                </button>
              </div>
              
              {/* Dynamic Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userData.links && Object.entries(userData.links).map(([id, linkData]) => (
                  <div key={id} className="flex items-center space-x-2 text-gray-500">
                    <LinkIcon className="h-5 w-5" />
                    <a href={linkData.url || linkData.linkValue} className="text-indigo-600 hover:text-indigo-500 flex-grow truncate">
                      {linkData.platform || linkData.linkKey}
                    </a>
                    {isEditingLinks && (
                      <button 
                        onClick={() => handleRemoveLink(id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={updatingLinks}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Add new link form */}
              {isEditingLinks && (
                <div className="mt-4 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                  <input
                    type="text"
                    value={newLinkPlatform}
                    onChange={(e) => setNewLinkPlatform(e.target.value)}
                    placeholder="Platform (e.g. LinkedIn)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="URL (e.g. https://linkedin.com/in/...)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleAddLink}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center"
                    disabled={updatingLinks}
                  >
                    {updatingLinks ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium text-gray-900">Skills</h2>
              <button 
                onClick={() => setIsEditingSkills(!isEditingSkills)}
                className="text-indigo-600 hover:text-indigo-500 flex items-center text-sm"
              >
                {isEditingSkills ? 'Done' : (
                  <>
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit Skills
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skillObj) => (
                <span
                  key={skillObj._id}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center"
                >
                  {formatSkill(skillObj.skill)}
                  {isEditingSkills && (
                    <button 
                      onClick={() => handleRemoveSkill(skillObj._id)}
                      className="ml-2 text-indigo-700 hover:text-indigo-900"
                      disabled={updatingSkills}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
              
              {/* Add new skill form */}
              {isEditingSkills && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="New skill"
                    className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                    disabled={updatingSkills}
                  >
                    {updatingSkills ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;