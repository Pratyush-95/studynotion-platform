import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRejectedCourses } from "../../../../services/operations/adminCourseApprovalAPI";

export default function RejectedCoursesModal({ onClose }) {

  const { token } = useSelector((state) => state.auth);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRejectedCourses = async () => {

    setLoading(true);

    const response = await getRejectedCourses(token);

    if (response?.success) {
      setCourses(response.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRejectedCourses();
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/60 backdrop-blur-sm">

      <div className="w-[680px] max-w-[95%] rounded-xl bg-richblack-800 border border-richblack-700 p-5 shadow-2xl">

        <div className="flex items-center justify-between">

          <h2 className="text-xl font-semibold text-richblack-5">
            Rejected Courses
          </h2>

          <button
            onClick={onClose}
            className="text-richblack-100 text-xl"
          >
            ✕
          </button>

        </div>

        {
          loading ? (

            <div className="mt-8 text-richblack-5">
              Loading...
            </div>

          ) : (

            <div className="mt-5 space-y-3 max-h-[380px] overflow-y-auto pr-2">

              {
                courses.map((course) => (

                  <div
                    key={course._id}
                    className="rounded-lg border border-richblack-700 bg-richblack-900 p-3"
                  >

                    <h3 className="text-xl font-semibold text-richblack-5">
                      {course.courseName}
                    </h3>

                    <p className="text-lg text-richblack-300 mt-3">
                      Instructor :
                      {" "}
                      {course.instructor.firstName}
                      {" "}
                      {course.instructor.lastName}
                    </p>

                    <p className="text-lg text-richblack-300">
                      Rejected On :
                      {" "}
                      {new Date(course.updatedAt).toLocaleString()}
                    </p>

                    <p className="mt-4 rounded-lg bg-pink-900/20 border border-pink-500/30 p-4 text-lg text-pink-300 leading-8">
                      <span className="font-semibold text-pink-200">
                        Reason :
                        </span>{" "}
                        {course.rejectionReason}
                    </p>

                  </div>

                ))
              }

            </div>

          )
        }

      </div>

    </div>
  );

}