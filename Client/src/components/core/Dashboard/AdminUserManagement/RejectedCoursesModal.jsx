import { FaTimes } from "react-icons/fa";

const RejectedCoursesModal = ({ courses = [], onClose }) => {

  return (

    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-full max-w-5xl rounded-xl border border-richblack-700 bg-richblack-900 shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-richblack-700 p-6">

          <div>

            <h2 className="text-2xl font-bold text-richblack-5">
              Rejected Courses
            </h2>

            <p className="mt-1 text-richblack-400">
               Courses rejected by the Admin
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
            No Rejected Courses
        </h3>

        <p className="mt-3 text-richblack-400">
          This instructor has no rejected courses.
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
        bg-pink-500/20
        px-4
        py-1
        text-sm
        font-medium
        text-pink-200
      "
    >
      Rejected
    </span>

    <span className="text-richblack-300">
      Rejected by Admin
    </span>

  </div>

  {/* 👇 Reject Reason yahin aayega */}

  <div className="mt-4 rounded-lg bg-richblack-900 p-4">

    <p className="text-sm text-richblack-300">

      <span className="font-semibold text-pink-200">
        Reject Reason :
      </span>

      {" "}

      {course.rejectReason || "Reason not available."}

    </p>

  </div>

  {/* 👇 Rejected Date */}

  <div className="mt-4 flex items-center justify-between">

    <div>

      <p className="text-xs uppercase tracking-widest text-richblack-400">
        Rejected On
      </p>

      <p className="text-richblack-25">
        {
          course.rejectedAt
            ? new Date(course.rejectedAt).toLocaleDateString()
            : "-"
        }
      </p>

    </div>

    <button
      className="
        rounded-lg
        bg-pink-200
        px-5
        py-2
        font-semibold
        text-white
        transition-all
        hover:bg-pink-300
      "
    >
      View Course
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

export default RejectedCoursesModal;