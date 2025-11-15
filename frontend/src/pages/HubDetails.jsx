import React from 'react';

const HubDetails = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">About Freelance Hub</h1>
          
          <div className="prose prose-lg">
            <p className="text-xl text-gray-700 mb-6">
              Welcome to our professional Freelance Hub - a dedicated platform for experienced 
              professionals and project seekers to collaborate effectively.
            </p>

            <div className="bg-blue-50 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">Key Features</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Direct communication between clients and freelancers
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Flexible project rate negotiation
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Detailed project specifications and requirements
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Secure payment protection
                </li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">For Freelancers</h3>
                <p className="text-gray-700">
                  Access high-quality projects, set your own rates, and build long-term 
                  client relationships.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">For Clients</h3>
                <p className="text-gray-700">
                  Find skilled professionals, discuss project details, and get quality 
                  deliverables.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HubDetails; 