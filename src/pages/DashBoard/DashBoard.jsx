import React from "react";
import { Outlet } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import MultiLineChart from "./MultiLineChart";
import Card from './Card'
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const stats = [
  { title: "Interview tracking credits", value: "680/1000", statusColor: "text-green-300", iconColor: "#4CAF50" },
  { title: "Number of Offer punch", value: "38", statusColor: "text-white", iconColor: "#2196F3" },
  { title: "Offer Letter Releases", value: "8/20", statusColor: "text-yellow-300", iconColor: "#FFEB3B" },
  { title: "Candidate ghosting notification", value: "3/100", statusColor: "text-red-300", iconColor: "#F44336" }
];

const DashBoard = () => {
  // const user = useSelector((state)=>state.user.data);
  // console.log("user is ",user.fullname)
  const navigate = useNavigate();
  return (
    <div className="h-[600px] overflow-auto bg-white p-5 no-scrollbar">
      <div className="p-4 bg-white rounded-lg shadow-md">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, <span className="text-purple-700">V Jai</span> 👋
            {/* Welcome, <span className="text-purple-700">{user.fullname}</span> 👋 */}
          </h1>
          <div className="flex items-center gap-3">

          
          <button
        className="flex items-center gap-2 px-5 py-2 bg-purple-900 text-white rounded-full shadow-md hover:bg-gradient-to-t from-purple-300 to-purple-600 hover:text-black transition-all"
        onClick={() => navigate("/offer-punch")}
      >
        <FaFileAlt />
        Offer Punch
      </button>
          <button
        className="flex items-center gap-2 px-5 py-2 bg-purple-900 text-white rounded-full shadow-md hover:bg-gradient-to-t from-purple-300 to-purple-600 hover:text-black transition-all"
        onClick={() => navigate("/release-offer")}
      >
        <FaFileAlt />
        Release an Offer
      </button>
        </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
        <Card key={index} {...item} />
      ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-8">
        <MultiLineChart />
      </div>

      {/* Outlet Section */}
      <div className="flex flex-col justify-center items-center p-3 md:p-5 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default DashBoard;