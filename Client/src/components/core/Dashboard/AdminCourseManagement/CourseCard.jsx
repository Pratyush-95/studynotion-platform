import { useNavigate } from "react-router-dom";

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  const createdDate = new Date(course.createdAt);

  return (
    <div className="flex gap-6 rounded-xl border border-richblack-700 bg-richblack-800 p-5 transition-all duration-200 hover:border-yellow-50">

      {/* Thumbnail */}
      <img
        src={course.thumbnail}
        alt={course.courseName}
        className="h-40 w-64 rounded-lg object-cover"
      />

      {/* Course Details */}
      <div className="flex flex-1 flex-col justify-between">

        <div>
          <h2 className="text-2xl font-semibold text-richblack-5">
            {course.courseName}
          </h2>

          <div className="mt-5 space-y-2 text-sm text-richblack-200">

            <p>
              <span className="font-semibold text-richblack-25">
                Instructor :
              </span>{" "}
              {course.instructorName}
            </p>

            <p>
              <span className="font-semibold text-richblack-25">
                Email :
              </span>{" "}
              {course.instructorEmail}
            </p>

            <p>
              <span className="font-semibold text-richblack-25">
                Created Date :
              </span>{" "}
              {createdDate.toLocaleDateString()}
            </p>

            <p>
              <span className="font-semibold text-richblack-25">
                Created Time :
              </span>{" "}
              {createdDate.toLocaleTimeString()}
            </p>

            <p>
              <span className="font-semibold text-richblack-25">
                Students Enrolled :
              </span>{" "}
              {course.totalStudents}
            </p>

            <p>
              <span className="font-semibold text-richblack-25">
                Status :
              </span>{" "}
              <span
                className={`font-semibold ${
                  course.status === "Published"
                    ? "text-caribbeangreen-300"
                    : course.status === "Pending"
                    ? "text-yellow-100"
                    : "text-pink-300"
                }`}
              >
                {course.status}
              </span>
            </p>
          </div>
        </div>

        {/* Button */}
        <div className="mt-6">
          <button
            onClick={() =>
              navigate(`/courses/${course._id}`)
            }
            className="rounded-md bg-yellow-50 px-5 py-2 font-semibold text-richblack-900 transition-all duration-200 hover:scale-95"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}