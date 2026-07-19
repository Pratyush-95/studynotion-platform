import { formattedDate } from "../../../../utils/dateFormatter";
import { useSelector } from "react-redux";
import { useStatec } from "react";
import { approveCourse } from "../../../../services/operations/adminCourseApprovalAPI";
import { useNavigate } from "react-router-dom";
import RejectCourseModal from "./RejectCourseModal";

export default function CourseCard({
  course,
  fetchCourses,
}) {

  const navigate = useNavigate();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const handleApprove = async () => {

    const response = await approveCourse(
      course._id,
      token
    );

    if (response?.success) {
      fetchCourses();
    }

  };

  return (
    <>
    <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-5">

      <div className="flex flex-col lg:flex-row gap-5">

        {/* Thumbnail */}

        <img
          src={course.thumbnail}
          alt={course.courseName}
          className="h-44 w-full lg:w-72 rounded-lg object-cover"
        />

        {/* Details */}

        <div className="flex-1">

          <h2 className="text-2xl font-semibold text-richblack-5">
            {course.courseName}
          </h2>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-y-4">

            <div>
              <p className="text-richblack-400 text-sm">
                Instructor
              </p>

              <p className="text-richblack-5">
                {course.instructor?.firstName}{" "}
                {course.instructor?.lastName}
              </p>
            </div>

            <div>
              <p className="text-richblack-400 text-sm">
                Category
              </p>

              <p className="text-richblack-5">
                {course.category?.name}
              </p>
            </div>

            <div>
              <p className="text-richblack-400 text-sm">
                Price
              </p>

              <p className="text-yellow-50">
                ₹{course.price}
              </p>
            </div>

            <div>
              <p className="text-richblack-400 text-sm">
                Students
              </p>

              <p className="text-richblack-5">
                {course.studentsEnroled?.length || 0}
              </p>
            </div>

            <div>
              <p className="text-richblack-400 text-sm">
                Created
              </p>

              <p className="text-richblack-5">
                {formattedDate(course.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-richblack-400 text-sm">
                Status
              </p>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold
                ${
                  course.status === "Pending"
                    ? "bg-yellow-500/20 text-yellow-300"
                    : course.status === "Published"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-pink-500/20 text-pink-300"
                }`}
              >
                {course.status}
              </span>

            </div>

          </div>

          {/* Buttons */}

          <div className="flex flex-wrap gap-3 mt-8">

            <button
              onClick={() => navigate(`/courses/${course._id}`)}
              className="bg-blue-600 hover:bg-blue-700 transition-all px-5 py-2 rounded-lg"
            >
              Preview
            </button>

            <button
               onClick={handleApprove}
              className="bg-caribbeangreen-100 hover:bg-caribbeangreen-300 text-richblack-900 transition-all px-5 py-2 rounded-lg font-semibold"
            >
              Approve
            </button>

            <button
             onClick={() => setShowRejectModal(true)}
              className="bg-pink-600 hover:bg-pink-700 transition-all px-5 py-2 rounded-lg"
            >
              Reject
            </button>

          </div>

        </div>

      </div>

    </div>

     {
      showRejectModal && (
        <RejectCourseModal
          courseId={course._id}
          token={token}
          fetchCourses={fetchCourses}
          onClose={() => setShowRejectModal(false)}
        />
      )
    }
  </>
  );
}
