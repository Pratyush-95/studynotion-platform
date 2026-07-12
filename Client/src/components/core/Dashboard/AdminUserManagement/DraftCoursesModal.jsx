import { FaTimes } from "react-icons/fa";

const DraftCoursesModal = ({ courses = [], onClose }) => {

  return (

    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-full max-w-5xl rounded-xl border border-richblack-700 bg-richblack-900 shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-richblack-700 p-6">

          <div>

            <h2 className="text-2xl font-bold text-richblack-5">
              Draft Courses
            </h2>

            <p className="mt-1 text-richblack-400">
               Courses still under development
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
            No Draft Courses
        </h3>

        <p className="mt-3 text-richblack-400">
           This instructor has no draft courses.
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

 <div className="flex flex-1 flex-col">

  <h3 className="text-xl font-semibold text-richblack-5">
    {course.courseName}
  </h3>

  <p className="mt-2 text-richblack-400">
    Submitted :
    {new Date(course.createdAt).toLocaleDateString()}
  </p>

  <div className="mt-4 flex items-center gap-3">

  <span
    className="
      rounded-full
      bg-richblack-700
      px-4
      py-1
      text-sm
      font-medium
      text-richblack-25
    "
  >
    Draft
  </span>

  <span className="text-richblack-300">
    Continue Editing
  </span>

</div>

 <div className="mt-4 rounded-lg bg-richblack-900 p-4">

  <p className="text-sm text-richblack-400">
    Completion Progress
  </p>

  <div className="mt-3 h-2 w-full rounded-full bg-richblack-700">

    <div
      className="h-2 rounded-full bg-yellow-100"
      style={{
        width: `${course.progress || 65}%`,
      }}
    />

  </div>

  <p className="mt-3 text-richblack-25">
    {course.progress || 65}% Completed
  </p>

</div>


<div className="mt-5 flex items-center justify-between">

  <div>

    <p className="text-xs uppercase tracking-widest text-richblack-400">
      Last Edited
    </p>

    <p className="text-richblack-25">
      {
        course.updatedAt
          ? new Date(course.updatedAt).toLocaleDateString()
          : "-"
      }
    </p>

  </div>

  <button
    className="
      rounded-lg
      bg-yellow-100
      px-5
      py-2
      font-semibold
      text-richblack-900
      transition-all
      hover:bg-yellow-50
    "
  >
    Continue Editing
  </button>

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

export default DraftCoursesModal;