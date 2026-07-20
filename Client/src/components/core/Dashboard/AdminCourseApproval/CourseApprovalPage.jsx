import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getPendingCourses,  getDashboardStats, } from "../../../../services/operations/adminCourseApprovalAPI";

import CourseStats from "./CourseStats";
import CourseFilters from "./CourseFilters";
import CourseCard from "./CourseCard";
import ApprovedCoursesModal from "./ApprovedCoursesModal";
import RejectedCoursesModal from "./RejectedCoursesModal";

export default function CourseApprovalPage() {

  const { token } = useSelector((state) => state.auth);

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);

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

  <>

    <div className="text-white px-6 pt-2 pb-6">

     <div className="rounded-2xl border border-richblack-700 bg-richblack-900 p-7 shadow-lg">

  <div className="flex items-center justify-between">

    <div>

      <h1 className="text-3xl font-bold text-yellow-50">
        📚 Course Approval
      </h1>

      <p className="mt-4 text-lg text-richblack-300">
        Review, approve and manage instructor submitted courses from one place.
      </p>

    </div>

    <div className="hidden lg:flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10 text-5xl">
      📖
    </div>

  </div>

</div>

  <div className="mt-5">
    <CourseStats
        stats={stats}
        onApprovedClick={() => setShowApprovedModal(true)}
        onRejectedClick={() => setShowRejectedModal(true)}
    />
</div>

  <div className="mt-6 rounded-2xl border border-richblack-700 bg-richblack-900 p-5">
    <CourseFilters
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
    />
  </div>

  <div className="mt-10 flex items-center justify-between">

    <div>

        <h2 className="text-2xl font-bold text-richblack-5">
            Pending Courses
        </h2>

        <p className="text-richblack-300 mt-1">
            {filteredCourses.length} Course(s) waiting for approval
        </p>

    </div>

</div>

      {
        loading ? (

          <div className="mt-10">
            Loading...
          </div>

        ) : (

          <div className="mt-8 space-y-6">

            {
              filteredCourses.length === 0 ? (

                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-richblack-700 bg-richblack-900 py-16">

    <div className="text-6xl">
        📚
    </div>

    <h3 className="mt-6 text-2xl font-semibold text-richblack-5">
        No Pending Courses
    </h3>

    <p className="mt-2 text-richblack-300">
        Everything looks good. There are no courses waiting for review.
    </p>

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
    {
  showApprovedModal && (
    <ApprovedCoursesModal
      onClose={() => setShowApprovedModal(false)}
    />
  )
}

{
  showRejectedModal && (
    <RejectedCoursesModal
      onClose={() => setShowRejectedModal(false)}
    />
  )
}
   </>
  );

}