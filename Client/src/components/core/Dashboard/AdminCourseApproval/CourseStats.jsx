export default function CourseStats({ stats }) {

  // const pending = courses.filter(
  //   (course) => course.status === "Pending"
  // ).length;

  // const approved = courses.filter(
  //   (course) => course.status === "Published"
  // ).length;

  // const rejected = courses.filter(
  //   (course) => course.status === "Rejected"
  // ).length;

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">

      {/* Pending */}

      <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-5">

        <p className="text-richblack-300">
          Pending
        </p>

        <h2 className="text-3xl font-bold text-yellow-300 mt-2">
          {stats.pendingCourses}
        </h2>

      </div>

      {/* Approved */}

      <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-5">

        <p className="text-richblack-300">
          Approved
        </p>

        <h2 className="text-3xl font-bold text-green-400 mt-2">
          {stats.publishedCourses}
        </h2>

      </div>

      {/* Rejected */}

      <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-5">

        <p className="text-richblack-300">
          Rejected
        </p>

        <h2 className="text-3xl font-bold text-pink-400 mt-2">
          {stats.rejectedCourses}
        </h2>

      </div>

      {/* Total */}

      <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-5">

        <p className="text-richblack-300">
          Total Courses
        </p>

        <h2 className="text-3xl font-bold text-blue-400 mt-2">
          {stats.totalCourses}
        </h2>

      </div>

    </div>

  );

}