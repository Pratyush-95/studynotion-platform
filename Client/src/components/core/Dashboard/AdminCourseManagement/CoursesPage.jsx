import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAdminCourses } from "../../../../services/operations/adminAPI";
import CourseCard from "./CourseCard";

export default function CoursesPage() {
  const { token } = useSelector((state) => state.auth);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);

    const data = await getAdminCourses(token);

    if (data) {
      setCourses(data);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-richblack-5 text-lg">
          Loading Courses...
        </div>
      </div>
    );
  }

  return (
    <div className="text-richblack-5 w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">
            Courses
          </h1>

          <p className="mt-2 text-richblack-300">
            Total Courses : {courses.length}
          </p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-10 text-center">
          No Courses Found
        </div>
      ) : (
        <div className="grid gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
            />
          ))}
        </div>
      )}
    </div>
  );
}