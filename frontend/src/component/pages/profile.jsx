import React from "react";

const Profile = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg p-8 bg-white shadow-md rounded-2xl transition-all duration-300 hover:shadow-lg">
        {/* Avatar Section */}
        <div className="flex flex-col items-center text-center relative">
          <div className="relative group">
            <img
              src="https://via.placeholder.com/100"
              alt="User Avatar"
              className="w-28 h-28 rounded-full border-4 border-gray-200 mb-4 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight">John Doe</h2>
          <p className="text-gray-500 text-sm mt-1">johndoe@example.com</p>
        </div>

        {/* Info Section */}
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center border-b pb-3 transition-all duration-200 hover:pl-2">
            <span className="text-gray-600 font-medium">Username:</span>
            <span className="font-medium">johndoe</span>
          </div>
          <div className="flex justify-between items-center border-b pb-3 transition-all duration-200 hover:pl-2">
            <span className="text-gray-600 font-medium">Phone:</span>
            <span className="font-medium">+1 234 567 890</span>
          </div>
          <div className="flex justify-between items-center border-b pb-3 transition-all duration-200 hover:pl-2">
            <span className="text-gray-600 font-medium">Address:</span>
            <span className="font-medium">123 Main St, NY</span>
          </div>
        </div>

        {/* Button Section */}
        <div className="mt-8 flex justify-center">
          <button className="flex items-center gap-2 bg-background-sky text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-button-hover hover:scale-105 active:scale-95">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 3.487a2.25 2.25 0 0 1 3.182 3.182L7.31 19.404a4.5 4.5 0 0 1-1.91 1.147l-3.214.963a.375.375 0 0 1-.47-.47l.963-3.214a4.5 4.5 0 0 1 1.147-1.91L16.862 3.487z"
              />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;