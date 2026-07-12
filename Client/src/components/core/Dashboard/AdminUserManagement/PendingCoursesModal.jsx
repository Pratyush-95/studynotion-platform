import { FaTimes } from "react-icons/fa";

const PendingCoursesModal = ({ courses = [], onClose }) => {

  return (

    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-full max-w-5xl rounded-xl border border-richblack-700 bg-richblack-900 shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-richblack-700 p-6">

          <div>

            <h2 className="text-2xl font-bold text-richblack-5">
              Pending Courses
            </h2>

            <p className="mt-1 text-richblack-400">
              Waiting for Admin Review
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg bg-richblack-800 p-3 hover:bg-richblack-700"
          >
            <FaTimes />
          </button>

        </div>

        {/* Body */}

        <div className="max-h-[70vh] overflow-y-auto p-6">

            {/* Body */}

<div className="max-h-[70vh] overflow-y-auto p-6">

  {
    courses.length === 0 ? (

      <div className="py-20 text-center">

        <h3 className="text-2xl font-semibold text-richblack-5">
          No Pending Courses
        </h3>

        <p className="mt-3 text-richblack-400">
          This instructor has no pending courses.
        </p>

      </div>

    ) : (

      <div className="space-y-5">

        {courses.map((course) => (

          <div
            key={course._id}
            className="rounded-xl border border-richblack-700 bg-richblack-800 p-5"
          >

            <div className="flex gap-5">

  <img
    src={course.thumbnail}
    alt={course.courseName}
    className="h-28 w-44 rounded-lg object-cover"
  />

  <div className="flex flex-1 flex-col justify-between">

    <div>

      <h3 className="text-xl font-semibold text-richblack-5">
        {course.courseName}
      </h3>

      <p className="mt-2 text-richblack-400">
        Submitted :
        {new Date(course.createdAt).toLocaleDateString()}
      </p>

    </div>

    <div className="flex items-center gap-3">

      <span className="rounded-full bg-yellow-500/20 px-4 py-1 text-sm text-yellow-300">
        Pending Review
      </span>

      <span className="text-richblack-400">
        Waiting for Admin Approval
      </span>

    </div>

  </div>

</div>

          </div>

        ))}

      </div>

    )
  }

</div>

        </div>

      </div>

    </div>

  );

};

export default PendingCoursesModal;