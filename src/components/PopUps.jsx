import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "./Loader";
import { useSelector, useDispatch } from "react-redux";
import { isValidEmail } from "../utils";
import { setUserHistory } from "../redux/UserSlice";
import api from "../utils/api";

function PopUps({ setshowPopUps, emailSearch, setSearchedResponseData, setError }) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.user.data);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? '';
  const  token  = useSelector((state) => state.user.data?.token);;

  async function checkStatusHandler() {
    try {
      setLoading(true);

      if (!emailSearch) {
        toast.error("Please provide an email");
        setshowPopUps(false);
        return;
      }

      if (!isValidEmail(emailSearch)) {
        toast.error("Please provide a valid email");
        setshowPopUps(false);
        return;
      }

      if (Number(data?.credits) === 0) {
        toast.error("You do not have enough credits left");
        setshowPopUps(false);
        return;
      }

      const backendUrl = `${API_URL}/api/users/user-info`;
      const response = await api.post(
        backendUrl,
        { email: emailSearch, userId: data?._id },
        {
          withCredentials: true,  
          headers: {
            Authorization: `Bearer ${token}`,

          }
        }
      );

      console.log(response.data.data)

      toast.success("Data fetched successfully");
      setSearchedResponseData(response.data.data);

      const temp = {
        email: emailSearch,
        createdAt: new Date().toISOString(),
        appliedCompanies: response.data.data?.filteredAppliedCompanies || [],
      };
      console.log(temp)
      dispatch(setUserHistory(temp));
      setError("");
    } catch (error) {
      console.log("Error:", error);
      const temp = {
        email: emailSearch,
        createdAt: new Date().toISOString(),
        appliedCompanies: [],
      };
      dispatch(setUserHistory(temp));
      setError("not_found");

      setSearchedResponseData(null);
      toast.error(error?.response?.data?.message || "An error occurred");
      window.location.href = '/invite'
    } finally {
      setLoading(false);
      setshowPopUps(false);
    }
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
          <div className="bg-white m-8 p-8 rounded-xl shadow-xl max-w-md w-full">
            <p className="text-base font-semibold mb-4 text-center">
              To search a candidate, you need to burn one credit
            </p>
            <div className="flex gap-5 justify-center items-center text-xs font-semibold">
              <button
                onClick={() => setshowPopUps(false)}
                className="px-10 border-[1px] border-gray-500 text-black py-1 rounded-3xl"
              >
                Cancel
              </button>
              <button
                onClick={checkStatusHandler}
                className="py-1 px-10 border-[1px] border-gray-500 text-white rounded-3xl bg-[#56b54a]"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PopUps;