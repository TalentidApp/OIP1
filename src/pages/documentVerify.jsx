import { useState } from "react";
import axios from "axios";
import { useUserStore, useVerificationStore } from "../redux/userStore";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const DocumentUploadPopup = ({ apiUrl, onClose, onSkip, onSubmit }) => {
  const { userId: zustandUserId, verifiedDocuments, setVerifiedDocuments } = useUserStore();
  const { is403Error } = useVerificationStore();
  const { token, userId: reduxUserId, verifiedDocuments: backendVerifiedDocuments } = useSelector((state) => state.user.data || {});
  const [file, setFile] = useState(null);
  const [fileSelectedMessage, setFileSelectedMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [documentStatus, setDocumentStatus] = useState(null);

  const effectiveUserId = zustandUserId || reduxUserId;

  console.log("DocumentUploadPopup.jsx: Rendering with state:", {
    effectiveUserId,
    zustandUserId,
    reduxUserId,
    verifiedDocuments,
    backendVerifiedDocuments,
    is403Error,
    token,
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setUploadError("File size exceeds 5MB limit.");
        return;
      }
      setFile(selectedFile);
      setFileSelectedMessage(`Selected: ${selectedFile.name}`);
      setUploadError("");
    } else {
      setFile(null);
      setFileSelectedMessage("");
    }
  };

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError("Please upload a document.");
      return;
    }
    if (!effectiveUserId) {
      setUploadError("Please log in to upload documents.");
      toast.error("Please log in to upload documents.", { id: "login-required" });
      window.location.href = "/login";
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64String = reader.result;

      try {
        console.log("DocumentUploadPopup.jsx: Uploading document for userId:", effectiveUserId);
        const response = await axios.post(
          `${apiUrl}/api/auth/upload-documents`,
          {
            userId: effectiveUserId,
            document: base64String,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("DocumentUploadPopup.jsx: Document upload successful");
          setDocumentStatus("pending");
          setVerifiedDocuments(true);
          toast.success("Document uploaded. Verifying documents...", {
            id: "document-verified",
          }, {
            style: {
              backgroundColor: '#652d96',
              color: '#ffffff',
            },
          });
          onSubmit();
        }
      } catch (error) {
        console.error("DocumentUploadPopup.jsx: Upload error:", error);
        setUploadError(error.response?.data?.message || "Error uploading document.");
      }
    };

    reader.onerror = () => {
      console.error("DocumentUploadPopup.jsx: FileReader error");
      setUploadError("Error reading file.");
    };
  };

  const handleSkip = () => {
    setVerifiedDocuments(false);
    onSkip();
  };

  if (backendVerifiedDocuments === true) {
    setVerifiedDocuments(true);
    return null;
  }

  if ((verifiedDocuments || documentStatus === "pending") && !backendVerifiedDocuments) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Document Verification</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <p className="mb-4">
            Your document has been uploaded and is <strong>still verifying</strong>. We will notify you once verification is complete.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Verification</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <p className="mb-4">
          Upload a copy of your company identity (e.g., Business Registration Document, CIN
          Document, GST Document). <br />
          Allowed formats: png, jpg, jpeg, pdf (max 5MB).
        </p>
        <form onSubmit={handleDocumentSubmit}>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4 text-center">
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <p className="text-gray-500">Drop your file to upload or browse</p>
            </label>
            {fileSelectedMessage && (
              <p className="text-green-500 text-sm mt-2">{fileSelectedMessage}</p>
            )}
          </div>
          {uploadError && <p className="text-red-500 text-sm mb-4">{uploadError}</p>}
          <div className="flex justify-between">
            {!is403Error && (
              <button
                type="button"
                onClick={handleSkip}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
              >
                Skip
              </button>
            )}
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUploadPopup;