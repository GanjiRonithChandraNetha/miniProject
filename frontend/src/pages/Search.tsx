import React, { useState } from 'react';
import { Search as SearchIcon, Filter, Star } from 'lucide-react';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const freelancers = [
    {
      id: 1,
      name: 'Sarah Wilson',
      title: 'UI/UX Designer',
      rating: 4.9,
      hourlyRate: 45,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      skills: ['Figma', 'Adobe XD', 'Sketch'],
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Full Stack Developer',
      rating: 4.8,
      hourlyRate: 65,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      skills: ['React', 'Node.js', 'Python'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Search Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search freelancers, skills, or services..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button className="mt-4 md:mt-0 flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-5 w-5 text-gray-500" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {['Design', 'Development', 'Marketing', 'Writing'].map((filter) => (
            <span
              key={filter}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm cursor-pointer hover:bg-gray-200"
            >
              {filter}
            </span>
          ))}
        </div>
      </div>

      {/* Search Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {freelancers.map((freelancer) => (
          <div key={freelancer.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={freelancer.avatar}
                  alt={freelancer.name}
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{freelancer.name}</h3>
                  <p className="text-gray-500">{freelancer.title}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-medium">{freelancer.rating}</span>
                <span className="text-gray-500">• ${freelancer.hourlyRate}/hr</span>
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1  bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;