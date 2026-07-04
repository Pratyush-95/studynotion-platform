import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

import { auth, createRecaptcha } from "../../../../firebase"
import { linkWithPhoneNumber, signInWithPhoneNumber, signOut } from "firebase/auth"
import { updateProfile } from "../../../../services/operations/SettingsAPI"
import { getUserDetails } from "../../../../services/operations/profileAPI"
import IconBtn from "../../../common/IconBtn"
import { apiConnector } from "../../../../services/apiconnector";
import { profileEndpoints } from "../../../../services/apis";

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]
const { CHECK_PHONE_API } = profileEndpoints;

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [otp, setOtp] = useState("")
  const [confirmationResult, setConfirmationResult] = useState(null)
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  const [verifiedPhone, setVerifiedPhone] = useState("")
  const [phoneBeingVerified, setPhoneBeingVerified] = useState("")
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [isResendDisabled, setIsResendDisabled] = useState(false)
  const OTP_RESEND_SECONDS = 120 // set timer here (120 or 180 seconds)

  const {
    register,
    handleSubmit,
    reset, // 🔥 important
    watch,
    formState: { errors },
  } = useForm()

  const contactNumber = watch("contactNumber")

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/[^0-9+]/g, "")
    if (cleaned.startsWith("+")) return cleaned
    if (cleaned.length === 11 && cleaned.startsWith("0")) return `+91${cleaned.slice(1)}`
    if (cleaned.length === 10) return `+91${cleaned}`
    if (cleaned.length === 12 && cleaned.startsWith("91")) return `+${cleaned}`
    return cleaned
  }

  // 🔥 form ko user data se sync karo
  useEffect(() => {
    if (user) {
      const initialContact = user?.additionalDetails?.contactNumber || ""
      reset({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
        about: user?.additionalDetails?.about || "",
        contactNumber: initialContact,
        gender: user?.additionalDetails?.gender || "",
      })
      setVerifiedPhone(initialContact)
      setIsPhoneVerified(Boolean(initialContact))
      setPhoneBeingVerified("")
    }
  }, [user, reset])

 

  useEffect(() => {
    if (contactNumber && verifiedPhone && contactNumber !== verifiedPhone) {
      setIsPhoneVerified(false)
      setIsOtpSent(false)
      setPhoneBeingVerified("")
      setConfirmationResult(null)
      setOtpTimer(0)
      setIsResendDisabled(false)
    }
  }, [contactNumber, verifiedPhone])

  useEffect(() => {
    if (otpTimer <= 0) return
    const id = setInterval(() => setOtpTimer((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [otpTimer])

  useEffect(() => {
  return () => {
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (err) {
        console.log(err);
      }

      window.recaptchaVerifier = null;
    }
  };
}, []);

  useEffect(() => {
    setIsResendDisabled(otpTimer > 0)
  }, [otpTimer])

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  

     const handleSendOtp = async () => {
  if (!contactNumber || contactNumber.trim().length < 10) {
    toast.error("Please enter a valid contact number to verify");
    return;
  }

  setIsSendingOtp(true);

  try {
    const phone = formatPhoneNumber(contactNumber);

    // Duplicate phone check
const checkResponse = await apiConnector(
  "POST",
  CHECK_PHONE_API,
  {
    contactNumber,
  },
  {
    Authorization: `Bearer ${token}`,
  }
);

if (!checkResponse.data.success) {
  return;
}
    console.log("Current User =>", auth.currentUser);

    console.log("PHONE =>", phone);

    let appVerifier = window.recaptchaVerifier;

    if (!appVerifier) {
      appVerifier = await createRecaptcha("recaptcha-container");
    }

    if (!appVerifier) {
      toast.error("Unable to initialize reCAPTCHA");
      return;
    }

    //const isLinkingPhone = Boolean(auth.currentUser);

    const confirmation = await signInWithPhoneNumber(
          auth,
          phone,
          appVerifier
        );
     setConfirmationResult({
  confirmation,
  isLinkingPhone: false,
});

    console.log("CONFIRMATION =>", confirmation);

    // setConfirmationResult({
    //   confirmation,
    //   isLinkingPhone,
    // });

    setPhoneBeingVerified(contactNumber);
    setIsOtpSent(true);
    setIsOtpModalOpen(true);
    setOtp("");
    // start resend timer
    setOtpTimer(OTP_RESEND_SECONDS)
    setIsResendDisabled(true)

    toast.success(`OTP sent to ${phone}`);
  } catch (error) {
    console.error("SEND PHONE OTP ERROR =>", error);
    toast.error(
      error?.response?.data?.message ||
      error?.message ||
      "Could not send OTP"
    );
  } 
  finally {
    setIsSendingOtp(false);
  }
};

     
    
  
  const handleVerifyOtp = async () => {
    if (!otp || otp.trim().length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    if (!confirmationResult) {
      toast.error("Please request an OTP first")
      return
    }

    setIsVerifyingOtp(true)
    try {
      const { confirmation, isLinkingPhone } = confirmationResult

      console.log("OTP =>", otp);
      console.log("confirmationResult =>", confirmationResult);
      console.log("confirmation =>", confirmation);
      await confirmation.confirm(otp)
      setIsPhoneVerified(true)
      setVerifiedPhone(contactNumber)
      setIsOtpModalOpen(false)
      setIsOtpSent(false)
      setConfirmationResult(null)
      // clear timer when verified
      setOtpTimer(0)
      setIsResendDisabled(false)
      toast.success("Contact number verified successfully")

      // if (!isLinkingPhone) {
      //   await signOut(auth)
      // }
    } catch (error) {
      console.log("VERIFY PHONE OTP ERROR -", error)
      toast.error(error.message || "Invalid OTP")
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const closeOtpModal = () => {
    setIsOtpModalOpen(false)
    setOtp("")
  }

  const onError = (errors) => {
  const firstError = Object.values(errors)[0];

  if (firstError?.message) {
    toast.error(firstError.message);
  } else {
    toast.error("Please fill all required fields");
  }
};

  // submit handler
  const submitProfileForm = async (data) => {
     
  //   if (!data.firstName?.trim()) {
  //   toast.error("First Name is required");
  //   return;
  // }

  // if (!data.lastName?.trim()) {
  //   toast.error("Last Name is required");
  //   return;
  // }

  // if (!data.dateOfBirth) {
  //   toast.error("Date of Birth is required");
  //   return;
  // }

  // if (!data.gender) {
  //   toast.error("Gender is required");
  //   return;
  // }

    if (data.contactNumber && data.contactNumber !== verifiedPhone) {
      toast.error("Please verify the entered contact number before saving.")
      return
    }

    try {
      await dispatch(updateProfile(token, data))

      // 🔥 latest data fetch karo
      await dispatch(getUserDetails(token, navigate))

      // optional redirect
      navigate("/dashboard/my-profile")
    } catch (error) {
      console.log("ERROR MESSAGE - ", error)
      // Show server-provided message (e.g., phone already registered)
      const message = error?.message || (error?.response && error.response.data && error.response.data.message) || "Could not update profile"
      toast.error(message)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitProfileForm,onError)}>
        {/* Profile Information */}
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
          <h2 className="text-lg font-semibold text-richblack-5">
            Profile Information
          </h2>

          {/* Name */}
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label className="lable-style">First Name</label>
              <input
                type="text"
                className="form-style"
                {...register("firstName", { required:  "First Name is required"})}
              />
              {errors.firstName && (
                <span className="text-yellow-100 text-xs">
                  Please enter your first name.
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label className="lable-style">Last Name</label>
              <input
                type="text"
                className="form-style"
                {...register("lastName", { required: "Please enter your last name"})}
              />
              {errors.lastName && (
                <span className="text-yellow-100 text-xs">
                  Please enter your last name.
                </span>
              )}
            </div>
          </div>

          {/* DOB + Gender */}
              <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label className="lable-style">Date of Birth</label>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                className="form-style"
                {...register("dateOfBirth", {
                  required: "Please enter your date of birth",
                  validate: (value) => {
                    if (!value) return "Please enter your date of birth"
                    const selected = new Date(value)
                    const now = new Date()
                    if (selected > now) return "Date of birth cannot be in the future"
                    return true
                  },
                })}
              />
              {errors.dateOfBirth && (
                <span className="text-yellow-100 text-xs">
                  {errors.dateOfBirth.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label className="lable-style">Gender</label>
              <select
                className="form-style"
                {...register("gender", { required: "Please Select your gender"})}
              >
                  <option value="">Select Gender</option>

                {genders.map((g, i) => (
                  <option key={i} value={g}>
                    {g}
                  </option>
                ))}
              </select>

              
            </div>

            
          </div>

          {/* Contact + About */}
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label className="lable-style">Contact Number</label>
              <div className="flex gap-3 items-center">
                <input
                  type="tel"
                  className="form-style flex-1"
                  {...register("contactNumber")}
                />

                {/* Replace the inline button with a text label while timer > 0.
                    When timer reaches 0, show a prominent Resend OTP button. */}
                {phoneBeingVerified === contactNumber && isOtpSent ? (
                    otpTimer > 0 ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpTimer > 0}
                      aria-disabled={otpTimer > 0}
                      className={`rounded-md px-6 py-3 font-semibold transition-all ${
                        otpTimer > 0
                          ? "cursor-not-allowed bg-richblack-700 text-richblack-300"
                          : "bg-yellow-50 text-richblack-900 hover:scale-95"
                      }`}
                    >
                      {`Resend (${formatTimer(otpTimer)})`}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className={`rounded-md px-6 py-3 font-semibold transition-all bg-yellow-50 text-richblack-900 hover:scale-95`}
                    >
                      Resend OTP
                    </button>
                  )
                ) : isPhoneVerified ? (
                  <span className="bg-caribbeangreen-100 text-white px-4 py-2 rounded-md">Verified</span>
                ) : isSendingOtp ? (
                  <span className="px-4 py-2 rounded-md bg-richblack-700 text-richblack-300">Sending...</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-4 py-2 rounded-md bg-yellow-300 text-richblack-900 hover:bg-yellow-400 font-semibold"
                  >
                    Verify
                  </button>
                )}
              </div>
              {isPhoneVerified ? (
                <span className="text-emerald-200 text-xs">
                  Contact number verified
                </span>
              ) : phoneBeingVerified === contactNumber && isOtpSent ? (
                <div className="mt-2 text-xs">
                  {otpTimer > 0 ? (
                    <p className="text-richblack-200">Didn't receive the OTP?</p>
                  ) : (
                    <p className="text-richblack-200">Didn't receive the OTP? <span className="text-yellow-50 font-semibold">Click Resend OTP.</span></p>
                  )}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label className="lable-style">About</label>
              <input
                type="text"
                className="form-style"
                {...register("about")}
              />
            </div>
          </div>
          {isOtpModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-richblack-900/70 p-4">
              <div className="w-full max-w-md rounded-2xl border border-richblack-700 bg-richblack-900 p-8 shadow-[0_0_60px_rgba(0,0,0,0.45)]">
                <div className="mb-6 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-richblack-5">
                      Verify Contact Number
                    </h3>
                    <p className="mt-2 text-sm text-richblack-300">
                      Enter the 6-digit OTP sent to your phone number to
                      confirm this contact number.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeOtpModal}
                    className="text-sm text-richblack-300 hover:text-richblack-5"
                  >
                    Close
                  </button>
                </div>
                <input
                  type="text"
                  value={otp}
                  maxLength={6}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="form-style w-full text-center tracking-[0.35em]"
                  placeholder="Enter OTP"
                />
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeOtpModal}
                    className="rounded-md bg-richblack-700 px-5 py-2 text-richblack-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifyingOtp}
                    className="rounded-md bg-yellow-300 px-5 py-2 text-richblack-900 hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isVerifyingOtp ? "Verifying..." : "Verify"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard/my-profile")}
            className="bg-richblack-700 text-richblack-50 px-5 py-2 rounded-md"
          >
            Cancel
          </button>

          <IconBtn type="submit" text="Save" />
        </div>
        <div id="recaptcha-container" />
      </form>
    </>
  )
}