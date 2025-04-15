import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, MapPin, Link as LinkIcon, Mail, Phone, Edit2, Plus, X, Save, Loader } from 'lucide-react';

const Profile = () => {
  // State for user data
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    bio: ''
  });
  
  // New skill and link states
  const [newSkill, setNewSkill] = useState('');
  const [newLinkPlatform, setNewLinkPlatform] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  
  // Loading states for different API calls
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingSkills, setUpdatingSkills] = useState(false);
  const [updatingLinks, setUpdatingLinks] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3636/v1/application/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("FreeToken")}`, // Example: Authorization header
            'Content-Type': 'application/json',     // Example: Content-Type
          },
        });
        console.log(response);
        setUserData(response.data);
        setProfileForm({
          username: response.data.username || '',
          email: response.data.email || '',
          bio: response.data.profile?.bio || ''
        });
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

  // Handle profile form change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      setUpdatingProfile(true);
      const response = await axios.put('/api/user/profile', {
        username: profileForm.username,
        email: profileForm.email,
        profile: {
          ...userData.profile,
        }
      });
      
      setUserData(prev => ({
        ...prev,
        username: response.data.username,
        email: response.data.email,
        profile: response.data.profile
      }));
      
      setIsEditingProfile(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Handle adding a new skill
  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    console.log(newSkill)
    try {
      setUpdatingSkills(true);
      const response = await axios.post('http://localhost:3636/v1/application/profile/update/skill', {
          type:"INSERT",
          skill: newSkill.toLowerCase().trim()
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("FreeToken")}`, // Example: Authorization header
            'Content-Type': 'application/json',     // Example: Content-Type
          },
        }
      );
      
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
      await axios.post(`http://localhost:3636/v1/application/profile/update/skill`,{
          type:"DELETE",
          skillId:skillId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("FreeToken")}`, // Example: Authorization header
            'Content-Type': 'application/json',     // Example: Content-Type
          },
        }
      );
      
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
      const response = await axios.post('http://localhost:3636/v1/application/profile/update/link', {
        type:"INSERT",
        linkKey: newLinkPlatform.trim(),
        linkValue: newLinkUrl.trim()
      });
      
      setUserData(prev => ({
        ...prev,
        links: {
          ...(prev.links || {}),
          [newLinkPlatform.trim()]: newLinkUrl.trim()
        }
      }));
      
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
  const handleRemoveLink = async (platform) => {
    try {
      setUpdatingLinks(true);
      await axios.delete(`localhost:3636/v1/application/profile/update/link`);
      
      const updatedLinks = { ...userData.links };
      delete updatedLinks[platform];
      
      setUserData(prev => ({
        ...prev,
        links: updatedLinks
      }));
    } catch (err) {
      console.error('Failed to remove link:', err);
      alert('Failed to remove link');
    } finally {
      setUpdatingLinks(false);
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
          <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg">
            <Camera className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5">
            <div className="-mt-16 relative">
              <img
                src="/api/placeholder/256/256"
                alt="Profile"
                className="h-32 w-32 rounded-full ring-4 ring-white bg-white"
              />
              <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-lg">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            <div className="mt-6 sm:mt-0 sm:flex-1">
              <div className="flex items-center justify-between">
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="username"
                    value={profileForm.username}
                    onChange={handleProfileChange}
                    className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">{formatUsername(username)}</h1>
                )}
                
                <button 
                  onClick={() => {
                    if (isEditingProfile) {
                      handleProfileUpdate();
                    } else {
                      setIsEditingProfile(true);
                    }
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                  disabled={updatingProfile}
                >
                  {updatingProfile ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : isEditingProfile ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
              {isEditingProfile ? (
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="mt-1 text-gray-500 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                />
              ) : (
                <p className="mt-1 text-gray-500">
                  {skills.length > 0 ? formatSkill(skills[0].skill) : "Developer"}
                </p>
              )}
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
                {Object.entries(links).map(([_id,{platform, url}]) => (
                  <div key={platform} className="flex items-center space-x-2 text-gray-500">
                    <LinkIcon className="h-5 w-5" />
                    <a href={url} className="text-indigo-600 hover:text-indigo-500 flex-grow truncate">
                      {platform}
                    </a>
                    {isEditingLinks && (
                      <button 
                        onClick={() => handleRemoveLink(platform)}
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

          {/* Bio */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">About</h2>
            {isEditingProfile ? (
              <textarea
                name="bio"
                value={profileForm.bio}
                onChange={handleProfileChange}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                rows={4}
              />
            ) : (
              <p className="mt-4 text-gray-500">
                {userData.profile?.bio || 
                  `Professional developer with expertise in ${skills.map(s => formatSkill(s.skill)).join(', ')}.`}
              </p>
            )}
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

// import React, { useState, useEffect } from 'react';
// import { Camera, Link as LinkIcon, Mail, Edit2, Plus, X, Save, Loader } from 'lucide-react';

// // Mock API functions to simulate backend calls
// const mockAPI = {
//   // Initial dummy data
//   dummyData: {
//     username: "ronithganji",
//     email: "ronithganji21062004@gmail.com",
//     profile: {
//       bio: "Professional developer passionate about web development and DevOps. I love creating scalable and maintainable applications."
//     },
//     skills: [
//       {
//         _id: "67fd488ec70077f1a16ce0a3",
//         skill: "web-developer"
//       },
//       {
//         _id: "67fd488ec70077f1a16ce0a4",
//         skill: "devops"
//       },
//       {
//         _id: "67fd488ec70077f1a16ce0a5",
//         skill: "fullstack"
//       }
//     ],
//     links: {
//       linkedIn: "https://www.linkedin.com/in/ronith-ganji-023093301/",
//       instagram: "https://www.instagram.com/ronith_chandra/",
//       github: "https://github.com/ronithganji",
//       portfolio: "https://ronithganji.dev"
//     }
//   },

//   // Mock API calls
//   getProfile: () => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({...mockAPI.dummyData});
//       }, 1000); // 1 second delay to simulate network
//     });
//   },

//   updateProfile: (data) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         mockAPI.dummyData = {...mockAPI.dummyData, ...data};
//         resolve({...mockAPI.dummyData});
//       }, 1000);
//     });
//   },

//   addSkill: (skill) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const newSkill = {
//           _id: Math.random().toString(36).substring(2, 15), // generate random id
//           skill: skill
//         };
//         mockAPI.dummyData.skills.push(newSkill);
//         resolve(newSkill);
//       }, 800);
//     });
//   },

//   removeSkill: (skillId) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         mockAPI.dummyData.skills = mockAPI.dummyData.skills.filter(
//           s => s._id !== skillId
//         );
//         resolve({success: true});
//       }, 800);
//     });
//   },

//   addLink: (platform, url) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         mockAPI.dummyData.links[platform] = url;
//         resolve({success: true});
//       }, 800);
//     });
//   },

//   removeLink: (platform) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         delete mockAPI.dummyData.links[platform];
//         resolve({success: true});
//       }, 800);
//     });
//   }
// };

// const Profile = () => {
//   // State for user data
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Edit states
//   const [isEditingProfile, setIsEditingProfile] = useState(false);
//   const [isEditingSkills, setIsEditingSkills] = useState(false);
//   const [isEditingLinks, setIsEditingLinks] = useState(false);
  
//   // Form states
//   const [profileForm, setProfileForm] = useState({
//     username: '',
//     email: '',
//     bio: ''
//   });
  
//   // New skill and link states
//   const [newSkill, setNewSkill] = useState('');
//   const [newLinkPlatform, setNewLinkPlatform] = useState('');
//   const [newLinkUrl, setNewLinkUrl] = useState('');
  
//   // Loading states for different API calls
//   const [updatingProfile, setUpdatingProfile] = useState(false);
//   const [updatingSkills, setUpdatingSkills] = useState(false);
//   const [updatingLinks, setUpdatingLinks] = useState(false);

//   // Fetch user data on component mount
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         setLoading(true);
//         // Using mock API instead of axios
//         const data = await mockAPI.getProfile();
//         setUserData(data);
//         setProfileForm({
//           username: data.username || '',
//           email: data.email || '',
//           bio: data.profile?.bio || ''
//         });
//       } catch (err) {
//         setError('Failed to load user data');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchUserData();
//   }, []);

//   // Format username for display
//   const formatUsername = (name) => {
//     return name ? name.split(' ').map(word => 
//       word.charAt(0).toUpperCase() + word.slice(1)
//     ).join(' ') : "User";
//   };

//   // Format skills for display
//   const formatSkill = (skill) => {
//     return skill
//       .split('-')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   };

//   // Handle profile form change
//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     setProfileForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle profile update
//   const handleProfileUpdate = async () => {
//     try {
//       setUpdatingProfile(true);
//       // Using mock API instead of axios
//       const response = await mockAPI.updateProfile({
//         username: profileForm.username,
//         email: profileForm.email,
//         profile: {
//           ...userData.profile,
//           bio: profileForm.bio
//         }
//       });
      
//       setUserData(response);
//       setIsEditingProfile(false);
//     } catch (err) {
//       console.error('Failed to update profile:', err);
//       alert('Failed to update profile');
//     } finally {
//       setUpdatingProfile(false);
//     }
//   };

//   // Handle adding a new skill
//   const handleAddSkill = async () => {
//     if (!newSkill.trim()) return;
    
//     try {
//       setUpdatingSkills(true);
//       // Using mock API instead of axios
//       const newSkillObj = await mockAPI.addSkill(newSkill.toLowerCase().trim());
      
//       setUserData(prev => ({
//         ...prev,
//         skills: [...(prev.skills || []), newSkillObj]
//       }));
      
//       setNewSkill('');
//     } catch (err) {
//       console.error('Failed to add skill:', err);
//       alert('Failed to add skill');
//     } finally {
//       setUpdatingSkills(false);
//     }
//   };

//   // Handle removing a skill
//   const handleRemoveSkill = async (skillId) => {
//     try {
//       setUpdatingSkills(true);
//       // Using mock API instead of axios
//       await mockAPI.removeSkill(skillId);
      
//       setUserData(prev => ({
//         ...prev,
//         skills: prev.skills.filter(skill => skill._id !== skillId)
//       }));
//     } catch (err) {
//       console.error('Failed to remove skill:', err);
//       alert('Failed to remove skill');
//     } finally {
//       setUpdatingSkills(false);
//     }
//   };

//   // Handle adding a new link
//   const handleAddLink = async () => {
//     if (!newLinkPlatform.trim() || !newLinkUrl.trim()) return;
    
//     try {
//       setUpdatingLinks(true);
//       // Using mock API instead of axios
//       await mockAPI.addLink(newLinkPlatform.trim(), newLinkUrl.trim());
      
//       setUserData(prev => ({
//         ...prev,
//         links: {
//           ...(prev.links || {}),
//           [newLinkPlatform.trim()]: newLinkUrl.trim()
//         }
//       }));
      
//       setNewLinkPlatform('');
//       setNewLinkUrl('');
//     } catch (err) {
//       console.error('Failed to add link:', err);
//       alert('Failed to add link');
//     } finally {
//       setUpdatingLinks(false);
//     }
//   };

//   // Handle removing a link
//   const handleRemoveLink = async (platform) => {
//     try {
//       setUpdatingLinks(true);
//       // Using mock API instead of axios
//       await mockAPI.removeLink(platform);
      
//       const updatedLinks = { ...userData.links };
//       delete updatedLinks[platform];
      
//       setUserData(prev => ({
//         ...prev,
//         links: updatedLinks
//       }));
//     } catch (err) {
//       console.error('Failed to remove link:', err);
//       alert('Failed to remove link');
//     } finally {
//       setUpdatingLinks(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
//         <span className="ml-2 text-gray-600">Loading profile...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <p className="text-red-500">{error}</p>
//       </div>
//     );
//   }

//   const { username, email, skills = [], links = {} } = userData || {};

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         {/* Cover Image */}
//         <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
//           <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg">
//             <Camera className="h-5 w-5 text-gray-600" />
//           </button>
//         </div>

//         {/* Profile Info */}
//         <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
//           <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5">
//             <div className="-mt-16 relative">
//               <img
//                 src="/api/placeholder/256/256"
//                 alt="Profile"
//                 className="h-32 w-32 rounded-full ring-4 ring-white bg-white"
//               />
//               <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-lg">
//                 <Camera className="h-4 w-4 text-gray-600" />
//               </button>
//             </div>
            
//             <div className="mt-6 sm:mt-0 sm:flex-1">
//               <div className="flex items-center justify-between">
//                 {isEditingProfile ? (
//                   <input
//                     type="text"
//                     name="username"
//                     value={profileForm.username}
//                     onChange={handleProfileChange}
//                     className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
//                   />
//                 ) : (
//                   <h1 className="text-2xl font-bold text-gray-900">{formatUsername(username)}</h1>
//                 )}
                
//                 <button 
//                   onClick={() => {
//                     if (isEditingProfile) {
//                       handleProfileUpdate();
//                     } else {
//                       setIsEditingProfile(true);
//                     }
//                   }}
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
//                   disabled={updatingProfile}
//                 >
//                   {updatingProfile ? (
//                     <>
//                       <Loader className="h-4 w-4 mr-2 animate-spin" />
//                       Saving...
//                     </>
//                   ) : isEditingProfile ? (
//                     <>
//                       <Save className="h-4 w-4 mr-2" />
//                       Save
//                     </>
//                   ) : (
//                     <>
//                       <Edit2 className="h-4 w-4 mr-2" />
//                       Edit Profile
//                     </>
//                   )}
//                 </button>
//               </div>
//               {isEditingProfile ? (
//                 <input
//                   type="email"
//                   name="email"
//                   value={profileForm.email}
//                   onChange={handleProfileChange}
//                   className="mt-1 text-gray-500 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
//                 />
//               ) : (
//                 <p className="mt-1 text-gray-500">
//                   {skills.length > 0 ? formatSkill(skills[0].skill) : "Developer"}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Contact Info */}
//           <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
//             {/* Email */}
//             <div className="flex items-center space-x-2 text-gray-500">
//               <Mail className="h-5 w-5" />
//               <span>{email}</span>
//             </div>
            
//             {/* Links Section */}
//             <div className="col-span-1 sm:col-span-2">
//               <div className="flex items-center justify-between mb-2">
//                 <h3 className="text-md font-medium text-gray-900">Links</h3>
//                 <button 
//                   onClick={() => setIsEditingLinks(!isEditingLinks)}
//                   className="text-indigo-600 hover:text-indigo-500 flex items-center text-sm"
//                 >
//                   {isEditingLinks ? 'Done' : (
//                     <>
//                       <Edit2 className="h-3 w-3 mr-1" />
//                       Edit Links
//                     </>
//                   )}
//                 </button>
//               </div>
              
//               {/* Dynamic Links */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {Object.entries(links).map(([platform, url]) => (
//                   <div key={platform} className="flex items-center space-x-2 text-gray-500">
//                     <LinkIcon className="h-5 w-5" />
//                     <a href={url} className="text-indigo-600 hover:text-indigo-500 flex-grow truncate">
//                       {platform}
//                     </a>
//                     {isEditingLinks && (
//                       <button 
//                         onClick={() => handleRemoveLink(platform)}
//                         className="text-red-500 hover:text-red-700"
//                         disabled={updatingLinks}
//                       >
//                         <X className="h-4 w-4" />
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>
              
//               {/* Add new link form */}
//               {isEditingLinks && (
//                 <div className="mt-4 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
//                   <input
//                     type="text"
//                     value={newLinkPlatform}
//                     onChange={(e) => setNewLinkPlatform(e.target.value)}
//                     placeholder="Platform (e.g. LinkedIn)"
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                   />
//                   <input
//                     type="text"
//                     value={newLinkUrl}
//                     onChange={(e) => setNewLinkUrl(e.target.value)}
//                     placeholder="URL (e.g. https://linkedin.com/in/...)"
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                   />
//                   <button
//                     onClick={handleAddLink}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center"
//                     disabled={updatingLinks}
//                   >
//                     {updatingLinks ? (
//                       <Loader className="h-4 w-4 animate-spin" />
//                     ) : (
//                       <Plus className="h-4 w-4" />
//                     )}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Bio */}
//           <div className="mt-8">
//             <h2 className="text-lg font-medium text-gray-900">About</h2>
//             {isEditingProfile ? (
//               <textarea
//                 name="bio"
//                 value={profileForm.bio}
//                 onChange={handleProfileChange}
//                 className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                 rows={4}
//               />
//             ) : (
//               <p className="mt-4 text-gray-500">
//                 {userData.profile?.bio || 
//                   `Professional developer with expertise in ${skills.map(s => formatSkill(s.skill)).join(', ')}.`}
//               </p>
//             )}
//           </div>

//           {/* Skills */}
//           <div className="mt-8">
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="text-lg font-medium text-gray-900">Skills</h2>
//               <button 
//                 onClick={() => setIsEditingSkills(!isEditingSkills)}
//                 className="text-indigo-600 hover:text-indigo-500 flex items-center text-sm"
//               >
//                 {isEditingSkills ? 'Done' : (
//                   <>
//                     <Edit2 className="h-3 w-3 mr-1" />
//                     Edit Skills
//                   </>
//                 )}
//               </button>
//             </div>
            
//             <div className="mt-4 flex flex-wrap gap-2">
//               {skills.map((skillObj) => (
//                 <span
//                   key={skillObj._id}
//                   className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center"
//                 >
//                   {formatSkill(skillObj.skill)}
//                   {isEditingSkills && (
//                     <button 
//                       onClick={() => handleRemoveSkill(skillObj._id)}
//                       className="ml-2 text-indigo-700 hover:text-indigo-900"
//                       disabled={updatingSkills}
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   )}
//                 </span>
//               ))}
              
//               {/* Add new skill form */}
//               {isEditingSkills && (
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={newSkill}
//                     onChange={(e) => setNewSkill(e.target.value)}
//                     placeholder="New skill"
//                     className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                   />
//                   <button
//                     onClick={handleAddSkill}
//                     className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
//                     disabled={updatingSkills}
//                   >
//                     {updatingSkills ? (
//                       <Loader className="h-4 w-4 animate-spin" />
//                     ) : (
//                       <Plus className="h-4 w-4" />
//                     )}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;