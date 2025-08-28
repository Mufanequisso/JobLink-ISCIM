// src/components/JobCard.tsx
import React from 'react';

interface JobCardProps {
  title: string;
  type: string;
  location: string;
  company: string;
  perks?: string;
  published_at?: string;
  expires_at?: string;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  type,
  location,
  company,
  perks,
  published_at,
  expires_at
}) => {
  return (
    <div
      className="job-card-content bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-2xl 
                 transition transform hover:-translate-y-1 duration-300 p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <span className="px-2 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full capitalize">
            {type}
          </span>
        </div>

        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Company:</span> {company}
        </p>
        <p className="text-gray-500 mb-1">
          <span className="font-semibold">Location:</span> {location}
        </p>

        {perks && (
          <p className="text-gray-500 mb-1">
            <span className="font-semibold">Perks:</span> {perks}
          </p>
        )}

        {published_at && (
          <p className="text-gray-400 text-sm">
            <span className="font-semibold">Published:</span> {new Date(published_at).toLocaleDateString()}
          </p>
        )}

        {expires_at && (
          <p className="text-gray-400 text-sm">
            <span className="font-semibold">Expires:</span> {new Date(expires_at).toLocaleDateString()}
          </p>
        )}
      </div>

      <button
        className="mt-4 w-full py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-500 
                   hover:from-blue-700 hover:to-indigo-600 transition font-semibold"
      >
        View Details
      </button>
    </div>
  );
};

export default JobCard;
