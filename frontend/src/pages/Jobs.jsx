import React from 'react';

const Jobs = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Freelance Opportunities</h1>
          <p className="text-xl text-gray-600">
            Discover the latest freelance opportunities updated in real-time
          </p>
        </div>

        <div className="grid gap-6">
          {/* Example Job Cards */}
          {[1, 2, 3].map((job) => (
            <div key={job} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Senior Web Developer
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Looking for an experienced developer for a long-term project
                  </p>
                  <div className="flex gap-3">
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      React
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      Node.js
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-green-600 font-semibold">$50-70/hr</span>
                  <p className="text-sm text-gray-500">Posted 2 hours ago</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs; 