import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useUserStore, useVerificationStore } from "./redux/userStore";
import { toast } from "sonner";
import api, { setupAxiosInterceptors } from "./utils/api";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CandidateTracking from "./pages/index";
import BackgroundChecks from "./pages/backgroundChecks/BackgroundChecks";
import OfferIntelligence from "./pages/offerIntelligence/OfferIntelligence";
import People from "./components/backgroundChecks/People";
import Insufficiency from "./pages/backgroundChecks/Insufficiency";
import AddUser from "./pages/backgroundChecks/AddUser";
import SearchHistory from "./pages/CTS/SearchHistory";
import MainContent from "./pages/CTS/MainContent";
import CandidateList from "./components/offerIntelligence/List";
import Profile from "./pages/offerIntelligence/Profile";
import Predictions from "./components/offerIntelligence/Predictions";
import Pipeline from "./pages/CTS/Pipeline";
import AddCandidate from "./components/offerIntelligence/AddCandidate";
import ExtractDataFromPdf from "./pages/ExtractDataFromPdf";
import ForgotPassword from "./pages/ForgotPasswordPage";
import OfferPunch from "./pages/CTS/OfferPunch";
import Settings from "./pages/settings/Settings";
import Profiles from "./pages/settings/Profiles";
import Users from "./pages/settings/Users";
import Integerations from "./pages/settings/Integerations";
import Subscriptions from "./pages/settings/Subscriptions";
import Notifications from "./pages/settings/Notifications";
import DashBoard from "./pages/DashBoard/DashBoard";
import Onboarding from "./pages/onboarding/Onboarding";
import Offered from "./pages/onboarding/Offered";
import OnboardPlan from "./pages/onboarding/OnboardPlan";
import OnboardMaretial from "./pages/onboarding/OnboardMaretial";
import PublicRoute from "./pages/PublicRoutes";
import ProtectedRoute from "./pages/ProtectedRoute";
import Release_Offer from "./pages/ReleaseOffer/Release_Offer";
import Job_Offer from "./pages/JobOffer/Job_Offer";
import CareerPage from "./pages/CarrerPage/CarrerPage";
import OfferDetail from "./pages/JobOffer/Job_OfferDetails";
import InvitePage from "./pages/CTS/InvitePage";
import DocumentUploadPopup from "./pages/documentVerify";
import OtpVerificationPopup from "./pages/OtpVerify";
import CompanyForm from "./pages/CTS/CompanyForm";
import CheckoutPage from "./pages/Checkout";

function App() {
  const { showOtpPopup, showDocumentPopup, failedRequest, setOtpPopup, setDocumentPopup } =
    useVerificationStore();
  const { emailVerified, verifiedDocuments, setUserData, setVerifiedDocuments } = useUserStore();
  const user = useSelector((state) => state.user.data || {});
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_REACT_BACKEND_URL ?? "http://localhost:4000";

  useEffect(() => {
    console.log("App.jsx: Setting up Axios interceptors");
    console.log("App.jsx: Initial verification state:", { showOtpPopup, showDocumentPopup, failedRequest });
    setupAxiosInterceptors();

    if (user?.verifiedDocuments === true) {
      setVerifiedDocuments(true);
      setDocumentPopup(false);
    } else if (user?.verifiedDocuments === false && verifiedDocuments) {
      toast.success("Verifying documents...", { id: "document-verifying" });
    }

    const unsubscribe = useVerificationStore.subscribe((state) => {
      console.log("App.jsx: Verification store updated:", {
        showOtpPopup: state.showOtpPopup,
        showDocumentPopup: state.showDocumentPopup,
        failedRequest: state.failedRequest,
        is403Error: state.is403Error,
      });
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        if (!emailVerified || (emailVerified && !user?.isEmailVerified)) {
          // toast("Verifying email...", { id: "email-verifying" });
        }
        if (user?.verifiedDocuments === true) {
          setVerifiedDocuments(true);
          setDocumentPopup(false);
        } else if (verifiedDocuments && !user?.verifiedDocuments) {
          toast.success("Verifying documents...", { id: "document-verifying" });
        }
        return response;
      },
      (error) => {
        if (!emailVerified || (emailVerified && !user?.isEmailVerified)) {
          // toast("Verifying email...", { id: "email-verifying" });
        }
        if (user?.verifiedDocuments === true) {
          setVerifiedDocuments(true);
          setDocumentPopup(false);
        } else if (verifiedDocuments && !user?.verifiedDocuments) {
          toast.success("Verifying documents...", { id: "document-verifying" });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
      unsubscribe();
    };
  }, [emailVerified, verifiedDocuments, user, dispatch, setUserData, setVerifiedDocuments, setDocumentPopup]);

  const handleOtpVerify = async () => {
    console.log("App.jsx: OTP Verified, retrying request:", failedRequest);
    setOtpPopup(false);
    if (failedRequest) {
      try {
        const response = await api.request(failedRequest);
        console.log("App.jsx: Retry success:", response.data);
        toast.success("Action completed successfully");
        return response;
      } catch (error) {
        console.error("App.jsx: Retry failed:", error);
        toast.error(error.response?.data?.message || "Failed to retry action");
      }
    }
  };

  const handleOtpResend = () => {
    console.log("App.jsx: Resending OTP");
    toast.success("OTP resent successfully. Check your email.", { id: "otp-resent" }, {
      style: {
        backgroundColor: '#652d96',
        color: '#ffffff',
      },
    });
  };

  const handleOtpSkip = () => {
    console.log("App.jsx: Skipping OTP");
    setOtpPopup(false);
  };

  const handleOtpClose = () => {
    console.log("App.jsx: Closing OTP popup");
    setOtpPopup(false);
  };

  const handleDocumentSubmit = async () => {
    console.log("App.jsx: Document submitted, retrying request:", failedRequest);
    setDocumentPopup(false);
    if (failedRequest) {
      try {
        const response = await api.request(failedRequest);
        console.log("App.jsx: Retry success:", response.data);
        toast.success("Action completed successfully");
        return response;
      } catch (error) {
        console.error("App.jsx: Retry failed:", error);
      }
    }
  };

  const handleDocumentSkip = () => {
    console.log("App.jsx: Skipping document upload");
    setVerifiedDocuments(false);
    setDocumentPopup(false);
  };

  const handleDocumentClose = () => {
    console.log("App.jsx: Closing document popup");
    setDocumentPopup(false);
  };

  console.log("App.jsx: Rendering, showDocumentPopup:", showDocumentPopup, "userId:", user.userId);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/auth/forgot-password/:id" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/" element={<ProtectedRoute><CandidateTracking /></ProtectedRoute>}>
          <Route index element={<MainContent />} />
          <Route path="/invite" element={<InvitePage />} />
          <Route path="history" element={<SearchHistory />} />
          <Route path="pipeline/:userId" element={<Pipeline />} />
          <Route path="offer-punch" element={<OfferPunch />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/carrerpage" element={<CareerPage />} />
          <Route path="/joboffers" element={<Job_Offer />} />
          <Route path="/company/edit/:companyName" element={<CompanyForm />} />
          <Route path="/release-offer" element={<Release_Offer />} />
          <Route path="/subscription/checkout/:id" element={<CheckoutPage/>} />
          <Route path="/extractInfo" element={<ExtractDataFromPdf />} />
          <Route path="/joboffers/:id" element={<OfferDetail />} />
          <Route path="backgroundchecks" element={<BackgroundChecks />}>
            <Route index element={<People />} />
            <Route path="insufficiency" element={<Insufficiency />} />
            <Route path="adduser" element={<AddUser />} />
          </Route>
          <Route path="onboarding" element={<Onboarding />}>
            <Route index element={<Offered />} />
            <Route path="onboardplan" element={<OnboardPlan />} />
            <Route path="onboardingmaterial" element={<OnboardMaretial />} />
          </Route>
          <Route path="settings" element={<Settings />}>
            <Route index element={<Profiles />} />
            <Route path="integration" element={<Integerations />} />
            <Route path="user" element={<Users />} />
            <Route path="subscription" element={<Subscriptions />} />
            <Route path="notification" element={<Notifications />} />
          </Route>
          <Route path="offerIntelligence" element={<OfferIntelligence />}>
            <Route index element={<CandidateList />} />
            <Route path="profile" element={<Profile />} />
            <Route path="prediction" element={<Predictions />} />
            <Route path="addCandidate" element={<AddCandidate />} />
          </Route>
        </Route>
      </Routes>
      {showOtpPopup && (
        <OtpVerificationPopup
          apiUrl={API_URL}
          onClose={handleOtpClose}
          onSkip={handleOtpSkip}
          onVerify={handleOtpVerify}
          onResend={handleOtpResend}
        />
      )}
      {showDocumentPopup && !user?.verifiedDocuments && (
        <DocumentUploadPopup
          apiUrl={API_URL}
          onClose={handleDocumentClose}
          onSkip={handleDocumentSkip}
          onSubmit={handleDocumentSubmit}
        />
      )}
    </Router>
  );
}

export default App;