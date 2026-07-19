import { useState } from "react";
import IconBtn from "../../../common/IconBtn";
import { rejectCourse } from "../../../../services/operations/adminCourseApprovalAPI";

export default function RejectCourseModal({
  courseId,
  token,
  fetchCourses,
  onClose,
}) {
  const [reason, setReason] = useState("");

  const handleReject = async () => {
    if (!reason.trim()) {
      return;
    }

    const response = await rejectCourse(
      courseId,
      reason,
      token
    );

    if (response?.success) {
      fetchCourses();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/60 backdrop-blur-sm">

      <div className="w-11/12 max-w-md rounded-lg bg-richblack-800 border border-richblack-700 p-6">

        <h2 className="text-2xl font-semibold text-richblack-5">
          Reject Course
        </h2>

        <p className="mt-2 text-richblack-300">
          Please enter the reason for rejecting this course.
        </p>

        <textarea
          rows={5}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Write rejection reason..."
          className="mt-5 w-full rounded-md bg-richblack-700 p-3 text-richblack-5 outline-none"
        />

        <div className="mt-6 flex gap-4">

          <IconBtn
            text="Reject Course"
            onClick={handleReject}
          />

          <button
            onClick={onClose}
            className="rounded-md bg-richblack-300 px-5 py-2 font-semibold text-richblack-900"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}