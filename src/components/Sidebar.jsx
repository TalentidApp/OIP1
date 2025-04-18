import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { MdOutlineSettings } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { BiBriefcase } from "react-icons/bi";
import { BsPersonBadge } from "react-icons/bs";
import { BiSolidCheckShield } from "react-icons/bi";
import { SiLens } from "react-icons/si";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { GiBackwardTime } from "react-icons/gi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCandidateTrackingOpen, setIsCandidateTrackingOpen] = useState(false);

  const [selectedNav, setSelectedNav] = useState("Candidate Tracking");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCandidateTracking = () => {
    setIsCandidateTrackingOpen(!isCandidateTrackingOpen);
  };

  const location = useLocation();
  const isOfferPunchActive = location.pathname === "/offer-punch";

  return (
    <div className=" h-screen overflow-hidden flex fixed  ">
      {/* Menu Icon */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-4 text-black text-2xl md:hidden z-50"
      >
        {isOpen ? (
          <AiOutlineClose className="hover:scale-105 transition-all" />
        ) : (
          <AiOutlineMenu className="hover:scale-105 transition-all" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0  bottom-0 h-full sm:w-[70%]  lg:w-90   bg-gradient-to-b from-[#74449D] to-[#4B2775] text-white shadow-lg transform transition-transform duration-300 z-40 ${isOpen ? "translate-x-0" : "-translate-x-full "
          } md:relative md:translate-x-0 lg:w-80  flex flex-col justify-between  `}
      >
        {/* Header */}
        <div >
          <h1 className="text-xl font-bold text-center py-4 lg:border-b border-purple-400 mt-1">
            {selectedNav}
          </h1>

          {/* Navigation */}
          <nav className="mt-4 space-y-3 sm:space-y-0 sm:mt-[1px]  ">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-4 px-4 py-6 bg-purple-400  shadow-md "
                  : "flex items-center space-x-4 px-4 py-6 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95  transition-all duration-200"
              }
              onClick={() => setSelectedNav("Dashboard")}
            >
              <MdDashboard className="h-6 w-6" />
              <span className="text-sm font-medium">Dashboard</span>
            </NavLink>

            <div>
              <NavLink
                to="/"
                onClick={() => {
                  toggleCandidateTracking(); // Call your first function
                  setSelectedNav("Candidate Tracker"); // Call your second function
                }}
                className={({ isActive }) =>
                  isActive || isOfferPunchActive
                    ? "flex items-center space-x-4 pl-4 py-6 bg-purple-400 shadow-md"
                    : "flex items-center space-x-4 pl-4 py-6 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95 transition-all duration-200"
                }
              >
                <button
                  className="w-full flex items-center justify-start font-semibold "
                  onClick={(e) => {
                    e.preventDefault(); // Prevent NavLink default behavior on button click
                    setIsCandidateTrackingOpen(!isCandidateTrackingOpen);
                  }}
                >
                  <BiSolidCheckShield className="h-6 w-6" />
                  <span className="text-sm font-medium mr-3 ml-3">Candidate Search</span>
                  <FaChevronDown
                    className={`transition-transform ${isCandidateTrackingOpen ? "rotate-180 ml-10" : "ml-10"
                      }`}
                  />
                </button>
              </NavLink>

              {/* Sub-options for Candidate Tracking */}
              {isCandidateTrackingOpen && (
                <div className="w-full flex flex-col items-center justify-start">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive
                        ? "w-full flex items-center justify-center space-x-4 pl-4 py-3 pr-10 bg-purple-300 shadow-md"
                        : "w-full flex items-center justify-center space-x-4 pl-4 py-3 pr-10 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95 transition-all duration-200"
                    }
                    onClick={() => setSelectedNav("Candidate Tracker (Interview)")}
                  >
                    <BsPersonBadge className="h-5 w-5" />
                    <span className="text-center">Interview</span>
                  </NavLink>
                  <NavLink
                    to="/offer-punch"
                    className={({ isActive }) =>
                      isActive
                        ? "w-full flex items-center justify-center space-x-4 pl-4 py-3 pr-5 bg-purple-300 shadow-md"
                        : "w-full flex items-center justify-center space-x-4 pl-4 py-3 pr-5 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95 transition-all duration-200"
                    }
                    onClick={() => setSelectedNav("Candidate Tracker (Offer punch)")}
                  >
                    <BiEdit className="h-5 w-5" />
                    <span className="text-center">Offer Punch</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* <NavLink
              to="/backgroundchecks"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-4 px-4 py-3 bg-purple-400  shadow-md"
                  : "sm: flex items-center space-x-4 px-4 py-3 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95 transition-all duration-200"
              }
            >
              <TbUserCheck className="h-6 w-6" />
              <span className="text-sm font-medium">Background Checks</span>
            </NavLink> */}
            <NavLink
              to="/joboffers"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-4 px-4 py-6 bg-purple-400  shadow-md"
                  : "flex items-center space-x-4 px-4 py-6 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95  transition-all duration-200"
              }
              onClick={() => setSelectedNav("Job Offers")}
            >
              <BiBriefcase className="h-6 w-6" />
              <span className="text-sm font-medium">Job Offers</span>
            </NavLink>

            <NavLink
              to="/offerIntelligence"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-4 px-4 py-6 bg-purple-400  shadow-md"
                  : "flex items-center space-x-4 px-4 py-6 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95  transition-all duration-200"
              }
              onClick={() => setSelectedNav("Offer Intelligence")}
            >
              <SiLens className="h-5 w-5" />
              <span className="text-sm font-medium">Offer Lens</span>
            </NavLink>
            {/* <NavLink
              to="/onboarding"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-4 px-4 py-3 bg-purple-400  shadow-md"
                  : "flex items-center space-x-4 px-4 py-3 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95  transition-all duration-200"
              }
            >
              <TbFileStack className="h-6 w-6" />
              <span className="text-sm font-medium">Onboarding</span>
            </NavLink> */}
            {/* <NavLink
              to="/assetManagement"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-4 px-4 py-3 bg-purple-400  shadow-md"
                  : "flex items-center space-x-4 px-4 py-3 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95  transition-all duration-200"
              }
            >
              <FaSuperpowers className="h-6 w-6" />
              <span className="text-sm font-medium">Asset Management</span>
            </NavLink>
            <NavLink
              to="/performanceManagement"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-4 px-4 py-3 bg-purple-400  shadow-md"
                  : "flex items-center space-x-4 px-4 py-3 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95 transition-all duration-200"
              }
            >
              <CgPerformance className="h-6 w-6" />
              <span className="text-sm font-medium">
                Performance Management
              </span>
            </NavLink> */}
            {/* <NavLink
              to="/offboarding"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-4 px-4 py-3 bg-purple-400  shadow-md"
                  : "flex items-center space-x-4 px-4 py-3 hover:text-black hover:bg-[#E8DEF8] bg-opacity-95  transition-all duration-200"
              }
            >
              <TbFileStack className="h-6 w-6" />
              <span className="text-sm font-medium">Offboarding</span>
            </NavLink> */}
          </nav>
        </div>

        {/* Footer Buttons */}
        <div className=" px-4 pb-4 space-y-4 mb-24">
          {/* Support Button */}
          <Link
            to="/support"
            className="w-full flex items-center space-x-4 px-4 py-3 bg-transparent border border-white text-white rounded-full hover:bg-purple-300 hover:border-purple-500 hover:text-black transition-all duration-200"
          >
            <GiBackwardTime className="h-5 w-5" />
            <span className="text-sm font-medium">Support</span>
          </Link>

          {/* Settings Button */}
          <Link
            to="/settings"
            className="w-full flex items-center space-x-4 px-4 py-3 bg-white text-purple-700 rounded-full hover:bg-gray-100 transition-all duration-200"
            onClick={() => setSelectedNav("Settings")}
          >
            <MdOutlineSettings className="h-5 w-5" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>
      </div>

      {/* Content Overlay for smaller screens */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
