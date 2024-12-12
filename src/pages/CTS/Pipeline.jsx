import React, { useContext, useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { BiSearch } from "react-icons/bi";
import { MdSearch } from "react-icons/md";
import StepProgress from "../../components/CTS/Temp";
import { IoChevronBack } from "react-icons/io5";

function Pipeline({ user }) {
  // const { pipeline, setPipeline } = useContext(MyContext);
  // const [appliedRound, setAppliedRound] = useState(-1);

  // console.log("user ka data ",pipeline);

  // let roundNames = Array.isArray(pipeline?.round_name) ? pipeline?.round_name : [pipeline?.round_name]

  // useEffect(() => {
  //   if (pipeline) {
  //     setAppliedRound(pipeline.round);
  //   }
  // }, [pipeline]);

  // const RoundComponent = ({ roundName, index }) => (
  //   <div className='relative flex flex-col items-center'>
  //     <p className={`text-lg text-nowrap text-center mb-2 ${index <= appliedRound ? 'font-semibold text-black' : 'text-gray-500'}`}>
  //       {roundName}
  //     </p>
  //   </div>
  // );

  // Array of round names
  const roundNames = [
    "Screening Round",
    "Round 1",
    "Round 2",
    "Technical Round",
    "Culture Round",
    "HR & Final Round",
  ];

  const recommended_status = ["hire"];

  return (
    <div className="flex flex-col gap-6 w-full bg-[#f2f2f2] shadow-lg border-gray-300 border rounded-3xl py-6 lg:p-8">
      <div className="flex flex-col justify-center items-center p-4">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          Track Candidate Status
        </h1>

        <div className="flex items-center space-x-4 justify-center mb-10 w-full max-w-2xl">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter email address or phone number"
              className="w-full p-4 pl-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md"
            />
            <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" />
          </div>

          <button className="px-6 py-3 bg-[#803CD8] text-white font-medium rounded-full shadow-custom-purple hover:shadow-xl transition duration-200">
            Check Status
          </button>
        </div>
      </div>
      <div className="bg-[#EDEDED] rounded border border-gray-300">
        <div className="mt-10 ml-8">
          <button className="flex border border-gray-300 font-bold rounded-full bg-white p-2 gap-2">
            <IoChevronBack className="text-gray-400 mt-1" />
            Jainayak's Profile
          </button>
        </div>
        <div className="relative flex flex-col mt-5 items-center justify-center px-4 lg:px-8">
          <div className="font-bold text-xl">Infosys</div>
          <StepProgress
            roundName={roundNames}
            recommended_status={recommended_status}
          ></StepProgress>
        </div>

        <div className="flex justify-end px-4 lg:px-8 mt-20 mb-10">
          <button className="flex gap-2 bg-[#652D96] text-white px-5 py-2 rounded-full font-semibold hover:bg-purple-600 transition duration-300">
            <MdSearch className="h-6 w-6 mt-0" />
            Check another
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pipeline;
