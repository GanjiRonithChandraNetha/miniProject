import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Plus, X } from 'lucide-react';
import axios from 'axios';

interface Skill {
  skill: string;
}

interface LinkItem {
  [key: string]: string;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  skills: string[];
  links: { type: string; url: string }[];
}

const SignUp = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    skills: [],
    links: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  // For adding new skills and links
  const [newSkill, setNewSkill] = useState<string>('');
  const [newLinkType, setNewLinkType] = useState<string>('');
  const [newLinkUrl, setNewLinkUrl] = useState<string>('');
  
  const predefinedSkills = ['web-developer', 'devops', 'fullstack', 'backend', 'frontend', 'mobile'];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSkillChange = (skill: string) => {
    setFormData(prev => {
      if (prev.skills.includes(skill)) {
        return {
          ...prev,
          skills: prev.skills.filter(s => s !== skill)
        };
      } else {
        return {
          ...prev,
          skills: [...prev.skills, skill]
        };
      }
    });
  };
  
  const addCustomSkill = () => {
    if (newSkill.trim() !== '' && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };
  
  const addCustomLink = () => {
    if (newLinkType.trim() !== '' && newLinkUrl.trim() !== '') {
      const linkObj = { type: newLinkType.trim(), url: newLinkUrl.trim() };
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, linkObj]
      }));
      setNewLinkType('');
      setNewLinkUrl('');
    }
  };
  
  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  const removeLink = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, index) => index !== indexToRemove)
    }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.skills.length === 0) {
      newErrors.skills = 'Select or add at least one skill';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Format data for backend
        const dataToSend = {
          userName: formData.username,
          email: formData.email,
          password:formData.password,
          profile: {},
          skills: formData.skills,
          links: formData.links.map(link => ({ [link.type]: link.url }))
        };
        console.log(formData.password);
        console.log(dataToSend);
        // Simulate API call
          const response = await axios.post("http://localhost:3636/v1/application/signIn", dataToSend);
          console.log(response);
          localStorage.setItem("FreeToken",response.data.token)
          setSuccessMessage(response.data.message || 'Account created successfully!');cl
        } catch (error) {
          console.error('Error submitting form:', error);
          setErrors({ general: error.response?.data?.message || 'Failed to create account. Try again later.' });
        } finally {
          setIsSubmitting(false);
        }
        
    }
  };
  
  const gradientStyle = {
    background: 'linear-gradient(135deg, #640D5F 0%, #D91656 33%, #EB5B00 66%, #FFB200 100%)'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-full max-w-xs rounded-md" style={gradientStyle}></div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      {successMessage ? (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        </div>
      ) : (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Dynamic Skills Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                
                {/* Selected Skills */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map(skill => (
                    <span 
                      key={skill} 
                      className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
                    >
                      {skill}
                      <button 
                        type="button" 
                        className="ml-1 text-purple-600 hover:text-purple-900"
                        onClick={() => removeSkill(skill)}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                
                {/* Common Skills */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Common skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {predefinedSkills.map(skill => (
                      <button
                        type="button"
                        key={skill}
                        className={`text-xs px-3 py-1 rounded-full ${
                          formData.skills.includes(skill)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => handleSkillChange(skill)}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Add Custom Skill */}
                <div className="flex mt-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Add a custom skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                  />
                  <button
                    type="button"
                    className="bg-purple-600 text-white px-3 py-2 rounded-r-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    onClick={addCustomSkill}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
              </div>
              
              {/* Dynamic Links Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Links
                </label>
                
                {/* Existing Links */}
                {formData.links.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {formData.links.map((link, index) => (
                      <div key={index} className="flex items-center">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-l-md min-w-16 text-sm">
                          {link.type}
                        </span>
                        <span className="bg-gray-50 flex-1 px-2 py-1 text-sm text-gray-600 border-y border-r border-gray-300 truncate">
                          {link.url}
                        </span>
                        <button
                          type="button"
                          className="bg-red-100 text-red-600 px-2 py-1 hover:bg-red-200 focus:outline-none"
                          onClick={() => removeLink(index)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add New Link */}
                <div className="grid grid-cols-6 gap-2">
                  <input
                    type="text"
                    className="col-span-2 px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Type (e.g. GitHub)"
                    value={newLinkType}
                    onChange={(e) => setNewLinkType(e.target.value)}
                  />
                  <input
                    type="url"
                    className="col-span-3 px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="URL"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                  />
                  <button
                    type="button"
                    className="col-span-1 bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    onClick={addCustomLink}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={gradientStyle}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {isSubmitting ? 'Creating account...' : 'Sign up'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;