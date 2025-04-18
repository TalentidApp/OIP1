import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { dateDifference } from "../../utils";

const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
  });
};

const Release_Offer = () => {
  const data = useSelector((state) => state.user.data);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    jobTitle: "",
    joiningDate: "",
    expiryDate: "",
    emailSubject: "",
    emailMessage: "",
    candidateEmail: "",
    candidateName: "",
    candidatePhoneNo: "",
    companyName: data.company,
    offerLetter: null,
    candidateResume: null,
  });
  const [errors, setErrors] = useState({}); // State to store validation errors
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL?? '';
  const  token  = useSelector((state) => state.user.data?.token);;

  const validatePhoneNumber = (phoneNo) => {
    // Basic validation: 10 digits (e.g., 1234567890)
    // You can modify the regex for a more specific format, e.g., +XX-XXXXXXXXXX
    const phoneRegex = /^\d{10}$/;
    if (!phoneNo) return "Phone number is required";
    if (!phoneRegex.test(phoneNo)) return "Phone number must be 10 digits";
    return "";
  };

  const validateJoiningDate = (joiningDate) => {
    if (!joiningDate) return "Joining date is required";

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    const joining = new Date(joiningDate);

    if (isNaN(joining.getTime())) return "Invalid joining date format";
    if (joining < today) return "Joining date must be today or a future date";
    return "";
  };

  const validateExpiryDate = (expiryDate, joiningDate) => {
    if (!expiryDate) return "Expiry date is required";

    const expiry = new Date(expiryDate);
    if (isNaN(expiry.getTime())) return "Invalid expiry date format";

    if (!joiningDate) return "Please enter the joining date first";

    const joining = new Date(joiningDate);
    if (expiry <= joining) return "Expiry date must be after the joining date";

    const diffDays = dateDifference(joiningDate, expiryDate);
    if (diffDays > 90) return "Expiry date must be within 90 days of the joining date";

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form state
    setForm((prev) => ({ ...prev, [name]: value }));

    // Validate the field and update errors
    let newErrors = { ...errors };

    if (name === "candidatePhoneNo") {
      newErrors.candidatePhoneNo = validatePhoneNumber(value);
    } else if (name === "joiningDate") {
      newErrors.joiningDate = validateJoiningDate(value);
      // Re-validate expiry date if joining date changes
      if (form.expiryDate) {
        newErrors.expiryDate = validateExpiryDate(form.expiryDate, value);
      }
    } else if (name === "expiryDate") {
      newErrors.expiryDate = validateExpiryDate(value, form.joiningDate);
    }

    setErrors(newErrors);
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  const validateFormStep1 = () => {
    const newErrors = {
      jobTitle: !form.jobTitle ? "Job title is required" : "",
      candidateName: !form.candidateName ? "Candidate name is required" : "",
      candidateEmail: !form.candidateEmail ? "Candidate email is required" : "",
      candidatePhoneNo: validatePhoneNumber(form.candidatePhoneNo),
      joiningDate: validateJoiningDate(form.joiningDate),
      expiryDate: validateExpiryDate(form.expiryDate, form.joiningDate),
    };

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.values(newErrors).every((error) => error === "");
  };

  const validateFormStep2 = () => {
    const newErrors = {
      emailSubject: !form.emailSubject ? "Email subject is required" : "",
      emailMessage: !form.emailMessage ? "Email message is required" : "",
      offerLetter: !form.offerLetter ? "Offer letter is required" : "",
      candidateResume: !form.candidateResume ? "Candidate resume is required" : "",
    };

    setErrors((prev) => ({ ...prev, ...newErrors }));

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleNextStep = () => {
    if (validateFormStep1()) {
      setStep(2);
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    if (!validateFormStep2()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    let diffBwDays = dateDifference(form.joiningDate, form.expiryDate);
    if (diffBwDays > 90) {
      toast.error("Joining Date should be within 90 days of the Expiry Date");
      return;
    }

    const offerLetterBase64 = await readFileAsBase64(form.offerLetter);

    const digioRequestBody = {
      file_name: `offer-letter-${form.candidateName}`,
      file_data: offerLetterBase64,
      signers: [
        {
          identifier: form.candidateEmail,
          reason: "for sign the offer letter",
          sign_type: "electronic",
        },
      ],
      display_on_page: "All",
      include_authentication_url: true,
    };

    console.log("digio req body at the frontend side ", digioRequestBody);

    var formData = new FormData();
    formData.append("jobTitle", form.jobTitle);
    formData.append("joiningDate", form.joiningDate);
    formData.append("expiryDate", form.expiryDate);
    formData.append("emailSubject", form.emailSubject);
    formData.append("emailMessage", form.emailMessage);
    formData.append("candidateEmail", form.candidateEmail);
    formData.append("candidateName", form.candidateName);
    formData.append("candidatePhoneNo", form.candidatePhoneNo);
    formData.append("companyName", form.companyName);

    formData.append("offerLetter", form.offerLetter, form.offerLetter.name);
    formData.append("candidateResume", form.candidateResume, form.candidateResume.name);

    formData.append("digioReqBody", JSON.stringify(digioRequestBody));

    try {
      console.log("Form data is", form);
      const response = await axios.post(
        `${API_URL}/api/offer/create-offer`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("Response is", response.data);
      toast.success("Offer released successfully!");
      setTimeout(() => {
        window.location.reload();
      },2000)
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-8 bg-white p-6 sm:p-8 shadow-xl rounded-xl mt-10 border border-gray-200">
      {/* Stepper Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 relative">
        {["Offer Details", "Release Offer"].map((label, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full text-white text-lg font-semibold transition-all duration-300 ${
                step === index + 1 ? "bg-indigo-600" : "bg-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <p
              className={`text-sm mt-2 font-medium ${
                step === index + 1 ? "text-indigo-600" : "text-gray-500"
              }`}
            >
              {label}
            </p>
          </div>
        ))}
        <div
          className={`absolute top-6 left-1/4 w-1/2 h-1 ${
            step === 2 ? "bg-indigo-600" : "bg-gray-300"
          }`}
        ></div>
      </div>

      {/* Step 1 - Offer Details */}
      {step === 1 && (
        <form className="w-full space-y-5">
          {[
            "jobTitle",
            "candidateName",
            "candidateEmail",
            "candidatePhoneNo",
            "companyName",
            "joiningDate",
            "expiryDate",
          ].map((name, index) => (
            <div key={index}>
              <label className="font-semibold text-gray-700 capitalize">
                {name.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={name.includes("Date") ? "date" : "text"}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className={`border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  name === "companyName" ? "bg-gray-100 cursor-not-allowed" : ""
                } ${errors[name] ? "border-red-500" : ""}`}
                readOnly={name === "companyName"}
              />
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
              onClick={handleNextStep}
            >
              Next
            </button>
          </div>
        </form>
      )}

      {/* Step 2 - Release Offer */}
      {step === 2 && (
        <form className="w-full space-y-5" onSubmit={formSubmitHandler}>
          <div>
            <label className="font-semibold text-gray-700">Email Subject</label>
            <input
              type="text"
              name="emailSubject"
              value={form.emailSubject}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.emailSubject ? "border-red-500" : ""
              }`}
            />
            {errors.emailSubject && (
              <p className="text-red-500 text-sm mt-1">{errors.emailSubject}</p>
            )}
          </div>
          <div>
            <label className="font-semibold text-gray-700">Email Message</label>
            <ReactQuill
              theme="snow"
              value={form.emailMessage}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, emailMessage: value }))
              }
              className={`w-full border rounded-lg ${
                errors.emailMessage ? "border-red-500" : ""
              }`}
            />
            {errors.emailMessage && (
              <p className="text-red-500 text-sm mt-1">{errors.emailMessage}</p>
            )}
          </div>

          {["candidateResume", "offerLetter"].map((name, index) => (
            <div key={index}>
              <label className="font-semibold text-gray-700">
                Upload {name.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="file"
                name={name}
                onChange={handleFileChange}
                className={`w-full border rounded-lg p-3 ${
                  errors[name] ? "border-red-500" : ""
                }`}
              />
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Release Offer
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col justify-center items-center p-3 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Release_Offer;