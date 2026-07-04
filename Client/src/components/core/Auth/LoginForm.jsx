import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { useDispatch } from "react-redux"
import { Link, useNavigate , useLocation} from "react-router-dom"

import { login } from "../../../services/operations/authAPI"
import { toast } from "react-hot-toast"
import { auth } from "../../../firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { googleAuth } from "../../../services/operations/authAPI"

function LoginForm() {
  const navigate = useNavigate()

  const location = useLocation()
  // Prefer navigation state (used by some pages) then fallback to query param
  const redirectTo =
    (location.state && location.state.redirect) ||
    new URLSearchParams(location.search).get("redirect");

  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()

    console.log("Redirect To:", redirectTo);

    dispatch(login(email, password, navigate,  redirectTo))
  }

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      // extract Google's OAuth id_token which the backend verifies
      const credential = GoogleAuthProvider.credentialFromResult(result)
      // Prefer the Google-issued ID token if available, otherwise use firebase token.
      const idToken =
        credential?.idToken || result?._tokenResponse?.idToken || (await result.user.getIdToken())

      // Send token to backend for verification and login/signup
      dispatch(googleAuth(idToken, navigate, redirectTo))
    } catch (error) {
      console.error("Google Sign In Error", error)
      toast.error("Google Sign In Failed")
    }
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4"
    >
      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
        />
      </label>
      <label className="relative">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Password <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] z-[10] cursor-pointer"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>
        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
            Forgot Password
          </p>
        </Link>
      </label>
      <button
        type="submit"
        className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
      >
        Sign In
      </button>
      <div className="mt-4 flex items-center gap-x-4">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex w-full items-center justify-center gap-x-2 rounded-[8px] border border-richblack-700 bg-richblack-800 py-2 text-richblack-5"
        >
          <FcGoogle className="h-5 w-5" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </form>
  )
}

export default LoginForm