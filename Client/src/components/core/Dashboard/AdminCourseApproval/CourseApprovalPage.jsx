import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getPendingCourses,  getDashboardStats, } from "../../../../services/operations/adminCourseApprovalAPI";

import CourseStats from "./CourseStats";
import CourseFilters from "./CourseFilters";
import CourseCard from "./CourseCard";

export default function CourseApprovalPage() {

  const { token } = useSelector((state) => state.auth);

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  const [stats, setStats] = useState({
  pendingCourses: 0,
  publishedCourses: 0,
  rejectedCourses: 0,
  totalCourses: 0,
});

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchCourses = async () => {
  setLoading(true);

  const [pendingResponse, statsResponse] =
    await Promise.all([
      getPendingCourses(token),
      getDashboardStats(token),
    ]);

  if (pendingResponse?.success) {
    setCourses(pendingResponse.data);
    setFilteredCourses(pendingResponse.data);
  }

  if (statsResponse?.success) {
    setStats({
      pendingCourses:
        statsResponse.data.pendingCourses,
      publishedCourses:
        statsResponse.data.publishedCourses,
      rejectedCourses:
        statsResponse.data.rejectedCourses,
      totalCourses:
        statsResponse.data.totalCourses,
    });
  }

  setLoading(false);
};

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    let temp = [...courses];
    if (filter !== "All") {
      temp = temp.filter(
        (course) => course.status === filter
      );
    }

    if (search.trim() !== "") {
      temp = temp.filter((course) =>
        course.courseName
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    setFilteredCourses(temp);

  }, [search, filter, courses]);

  return (

    <div className="text-white p-6">

      <h1 className="text-3xl font-bold">
        Course Approval
      </h1>

      <p className="text-richblack-300 mt-2">
        Review, approve and reject instructor submitted courses.
      </p>

      <CourseStats stats={stats} />

      <CourseFilters
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />

      {
        loading ? (

          <div className="mt-10">
            Loading...
          </div>

        ) : (

          <div className="mt-8 flex flex-col gap-6">

            {
              filteredCourses.length === 0 ? (

                <div className="text-center text-richblack-300">

                  No Courses Found

                </div>

              ) : (

                filteredCourses.map((course) => (

                  <CourseCard
                    key={course._id}
                    course={course}
                    fetchCourses={fetchCourses}
                  />

                ))

              )
            }

          </div>

        )
      }

    </div>

  );

}