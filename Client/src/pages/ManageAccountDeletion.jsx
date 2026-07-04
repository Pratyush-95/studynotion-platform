import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cancelAccountDeletion } from "../services/operations/SettingsAPI";

export default function ManageDeletion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);

  const handleCancel = async () => {
    if (!token) {
      alert("Please login first to cancel deletion");
      // pass redirect using navigation state and query param as fallback
      const redirectPath = window.location.pathname;
      navigate(
        `/login?redirect=${encodeURIComponent(redirectPath)}`,
        { state: { redirect: redirectPath } }
      );

      return;
}

    await dispatch(cancelAccountDeletion(token));

    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-richblack-900">
      <div className="bg-richblack-800 p-8 rounded-lg max-w-md text-center">

        <h1 className="text-3xl text-white font-bold">
          Account Scheduled For Deletion
        </h1>

        <p className="text-richblack-300 mt-4">
          Your account is currently scheduled for deletion.
        </p>

        <p className="text-richblack-300 mt-2">
          If this was a mistake, you can cancel the deletion request before the scheduled date.
        </p>

        <button
          onClick={handleCancel}
          className="mt-6 bg-yellow-50 text-black px-5 py-2 rounded font-semibold"
        >
          Cancel Deletion
        </button>

      </div>
    </div>
  );
}