// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { employer } from '../../lib/api';
// import { toast } from 'react-hot-toast';

// const CreateJob = () => {
//   const navigate = useNavigate();
//   const [jobData, setJobData] = useState({
//     title: '',
//     description: '',
//     budget: '',
//     duration: '',
//     skills: '',
//     category: '',
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await employer.createJob({
//         ...jobData,
//         skills: jobData.skills.split(',').map(skill => skill.trim()),
//         budget: parseFloat(jobData.budget),
//       });
//       toast.success('Job created successfully!');
//       navigate('/employer/jobs');
//     } catch (error) {
//       toast.error('Failed to create job');
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <h1 className="text-2xl font-bold text-gray-900 mb-8">Create New Job</h1>

//       <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Job Title</label>
//           <input
//             type="text"
//             value={jobData.title}
//             onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Description</label>
//           <textarea
//             value={jobData.description}
//             onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
//             rows={4}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//             required
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Budget ($)</label>
//             <input
//               type="number"
//               value={jobData.budget}
//               onChange={(e) => setJobData({ ...jobData, budget: e.target.value })}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
//             <input
//               type="number"
//               value={jobData.duration}
//               onChange={(e) => setJobData({ ...jobData, duration: e.target.value })}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Required Skills</label>
//           <input
//             type="text"
//             value={jobData.skills}
//             onChange={(e) => setJobData({ ...jobData, skills: e.target.value })}
//             placeholder="e.g., React, Node.js, TypeScript"
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//             required
//           />
//           <p className="mt-1 text-sm text-gray-500">Separate skills with commas</p>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Category</label>
//           <select
//             value={jobData.category}
//             onChange={(e) => setJobData({ ...jobData, category: e.target.value })}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//             required
//           >
//             <option value="">Select a category</option>
//             <option value="web">Web Development</option>
//             <option value="mobile">Mobile Development</option>
//             <option value="design">Design</option>
//             <option value="writing">Writing</option>
//             <option value="marketing">Marketing</option>
//           </select>
//         </div>

//         <div className="flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
//           >
//             Create Job
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateJob;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employer } from '../../lib/api';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// Dummy data for testing
const dummyJobData = {
  title: "AI-Powered Chatbot Developer",
  description: "Job Title: AI Chatbot Developer (Node.js & Python)\n\nJob Type: Full-Time / Contract / Freelance\n\nLocation: Remote / On-Site (Specify Location)\n\nSalary: Competitive, based on experience\n\nJob Overview:\nWe are looking for an AI Chatbot Developer to design, develop, and deploy intelligent chatbot solutions. The ideal candidate should have expertise in AI, NLP, and chatbot frameworks, particularly using Node.js, Python, and OpenAI APIs.\n\nKey Responsibilities:\n\nDevelop AI-driven chatbots using NLP models\n\nIntegrate chatbots into web and mobile applications\n\nImplement speech-to-text and text-to-speech features\n\nTrain and fine-tune machine learning models for better user interaction\n\nEnsure chatbot security and data privacy compliance\n\nMonitor and improve chatbot performance through analytics\n\nWork closely with UI/UX designers to enhance conversational experience\n\nPerform testing, debugging, and deployment of chatbots.",
  skills: ["Node.js", "Python", "NLP", "OpenAI", "Dialogflow", "Chatbot Development", "TensorFlow", "REST API", "Socket.io", "Machine Learning", "AWS", "Firebase", "MongoDB", "MySQL", "Git", "GitHub"],
  budget: "250000",
  deadline: "2025-08-15",
  status: "vacant"
};

const CreateJob = () => {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    skills: [],
    status: 'vacant'
  });

  const [skillInput, setSkillInput] = useState('');
  const [isTestMode, setIsTestMode] = useState(false);

  // Load dummy data function
  const loadDummyData = () => {
    setJobData({
      ...dummyJobData,
      budget: dummyJobData.budget.toString()
    });
    setIsTestMode(true);
    toast.success('Dummy data loaded for testing');
  };

  // Clear form function
  const clearForm = () => {
    setJobData({
      title: '',
      description: '',
      budget: '',
      deadline: '',
      skills: [],
      status: 'vacant'
    });
    setIsTestMode(false);
    toast.success('Form cleared');
  };

  const handleAddSkill = () => {
    if (skillInput.trim() !== '' && !jobData.skills.includes(skillInput.trim())) {
      setJobData({
        ...jobData,
        skills: [...jobData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setJobData({
      ...jobData,
      skills: jobData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log the data in test mode instead of sending to API
    if (isTestMode) {
      console.log('Form submitted with data:', {
        ...jobData,
        budget: parseFloat(jobData.budget),
      });
      toast.success('Test successful! Check console for submitted data');
      return;
    }
    console.log({
      ...jobData,
      budget: parseFloat(jobData.budget),
    })
    try {
      const response = axios.post("http://localhost:3636/v1/application/employer/job/create",
        {
          ...jobData,
          budget: parseFloat(jobData.budget),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("FreeToken")}`, // Example: Authorization header
            'Content-Type': 'application/json',     // Example: Content-Type
          },
        }
      )
      toast.success('Job created successfully!');
      // navigate('/employer/jobs');
    } catch (error) {
      toast.error('Failed to create job');
      console.error('Error creating job:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Job</h1>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={loadDummyData}
            className="px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700"
          >
            Load Test Data
          </button>
          <button
            type="button"
            onClick={clearForm}
            className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700"
          >
            Clear Form
          </button>
        </div>
      </div>

      {isTestMode && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
          Test mode active. Form submission will log data to console instead of sending to API.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title</label>
          <input
            type="text"
            value={jobData.title}
            onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={jobData.description}
            onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
            rows={8}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget ($)</label>
            <input
              type="number"
              value={jobData.budget}
              onChange={(e) => setJobData({ ...jobData, budget: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              value={jobData.deadline}
              onChange={(e) => setJobData({ ...jobData, deadline: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Required Skills</label>
          <div className="flex mt-1">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., React, Node.js, TypeScript"
              className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-indigo-600 border border-transparent rounded-r-md text-sm font-medium text-white hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
          
          {jobData.skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {jobData.skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-indigo-600 hover:text-indigo-900"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={jobData.status}
            onChange={(e) => setJobData({ ...jobData, status: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="vacant">Vacant</option>
            <option value="filled">Filled</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
          >
            {isTestMode ? 'Test Submit' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;