import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getApprovedCourses } from "../../../../services/operations/adminCourseApprovalAPI";

export default function ApprovedCoursesModal({ onClose }) {

  const { token } = useSelector((state) => state.auth);

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchApprovedCourses = async () => {

    setLoading(true);

    const response = await getApprovedCourses(token);

    if (response?.success) {
      setCourses(response.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchApprovedCourses();
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/60 backdrop-blur-sm">

      <div className="w-[680px] max-w-[95%] rounded-xl bg-richblack-800 border border-richblack-700 p-5">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold text-richblack-5">
            Approved Courses
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

            <div className="mt-5 space-y-3 max-h-[450px] overflow-y-auto pr-2">

              {
                courses.map((course) => (

                  <div
                    key={course._id}
                    className="rounded-lg border border-richblack-700 p-4"
                  >

                    <h3 className="text-lg font-semibold text-richblack-5">
                      {course.courseName}
                    </h3>

                    <p className="text-richblack-300 mt-2">
                      Instructor :
                      {" "}
                      {course.instructor.firstName}
                      {" "}
                      {course.instructor.lastName}
                    </p>

                    <p className="text-richblack-300">
                      Approved On :
                      {" "}
                      {new Date(course.updatedAt).toLocaleString()}
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