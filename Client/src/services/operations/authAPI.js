import { toast } from "react-hot-toast";

import { setLoading ,setToken} from "../../slices/authSlice";
import { resetCart } from "../../slices/cartSlice";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
  GOOGLE_AUTH_API,
  LOGOUT_API,
} = endpoints;

// ✅ GOOGLE AUTH
export function googleAuth(idToken, navigate, redirectTo = null, accountType = null) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", GOOGLE_AUTH_API, {
        idToken,
        accountType,
      });

      console.log("GOOGLE AUTH RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");

     dispatch(setToken(response.data.token));

      const userImage = `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
      dispatch(setUser({ ...response.data.user, image: userImage }));

     localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...response.data.user, image: userImage })
      );

      const target = redirectTo || "/dashboard/my-profile";
      navigate(target);

    } catch (error) {
      console.log("GOOGLE AUTH ERROR............", error);
      const message = error.response?.data?.message || "Google Login Failed";
      toast.error(message);
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// ✅ SEND OTP
export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });

      console.log("SENDOTP API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully");

      // ✅ safe navigation
      if (navigate) navigate("/verify-email");

    } catch (error) {
      console.log("SENDOTP API ERROR............", error);
      toast.error(error.response?.data?.message || "Could Not Send OTP");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// ✅ SIGNUP (FIXED)
export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate,
  setError // ✅ FIXED
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      console.log("SIGNUP API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Signup Successful");
      navigate("/login"); // ✅ only success

    } catch (error) {
      console.log("SIGNUP API ERROR............", error);

      const message =
        error.response?.data?.message || "Invalid OTP";

      toast.error(message);

      // ✅ UI ko error bhejo
      if (setError) setError(message);

      // ❌ NO redirect here
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// ✅ LOGIN
export function login(email, password, navigate,  redirectTo = null) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");
      
      console.log("redirectTo received:", redirectTo);

      dispatch(setToken(response.data.token));

      const userImage =`https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;

  
      dispatch(setUser({ ...response.data.user, image: userImage }));

      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify({...response.data.user,
  image: userImage
}));

      // navigate to redirect target if provided, otherwise go to profile
      const target = redirectTo || "/dashboard/my-profile";
      navigate(target);

    } catch (error) {
      console.log("LOGIN API ERROR............", error);
        const message = error.response?.data?.message || "Login Failed";
        toast.error(message);

        // If user is not registered, show the error then redirect to signup
        try {
          const lower = message.toString().toLowerCase();
          if (lower.includes("not registered") || lower.includes("please sign up")) {
             //toast.error("Account not found. Redirecting to Sign Up...");
            setTimeout(() => {
              if (navigate) navigate("/signup");
            }, 3000); // give user 2s to read the toast before redirect

           // return ;
          }
        } catch (e) {
          // ignore any parsing errors
        }
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// ✅ LOGOUT
export function logout(navigate) {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
   // const token = getState().auth.token;
    try {
       await apiConnector("POST", LOGOUT_API);
    } catch (error) {
      console.log("LOGOUT API ERROR............", error);
      // Still clear client state so the user is logged out locally.
    }

    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged Out");
    navigate("/");
    dispatch(setLoading(false));
  };
}

// ✅ RESET PASSWORD TOKEN
export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });

      console.log("RESET PASSWORD TOKEN RESPONSE....", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);

    } catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send email for resetting password"
      );
    }

    dispatch(setLoading(false));
  };
}

// ✅ RESET PASSWORD
export function resetPassword(password, confirmPassword, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      console.log("RESET Password RESPONSE ... ", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password has been reset successfully");

    } catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error(
        error.response?.data?.message ||
          "Unable to reset password"
      );
    }

    dispatch(setLoading(false));
  };
}