import {
  FaUsers,
  FaStar,
  FaRupeeSign,
  FaEdit,
  FaEye,
  FaChartLine,
} from "react-icons/fa";
import { MdCategory } from "react-icons/md";

const PublishedCourseCard = ({
  course,
  onView,
  onEdit,
  onAnalytics,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800 transition-all duration-300 hover:border-yellow-400 hover:shadow-xl">

      {/* Thumbnail */}

      <img

       src={
        course.thumbnail ||
        "https://placehold.co/600x350?text=No+Thumbnail"
    }
    alt={course.courseName}
    className="h-44 w-full object-cover  "
      />

      <div className="p-5">

        {/* Course Name */}

        <div className="flex items-start justify-between">

          <div>

            <h2 className="text-xl font-semibold text-richblack-5">
              {course.courseName}
            </h2>

            <p className="mt-2 text-sm text-richblack-300">
              Published
            </p>

          </div>

          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-900">
            Live
          </span>

        </div>

        {/* Rating */}
        {/* Course Information */}

<div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">

  <div className="flex items-center gap-2">

    <FaStar className="text-yellow-400" />

    <span className="text-richblack-100 font-medium">
      {(course.averageRating || 0).toFixed(1)}
    </span>

  </div>

  <div className="flex items-center gap-2">

    <FaUsers className="text-blue-400" />

    <span className="text-richblack-100 font-medium">
      {course.studentsCount} Students
    </span>

  </div>

  <div className="flex items-center gap-2">

    <FaRupeeSign className="text-green-400" />

    <span className="text-richblack-100 font-medium">
      ₹{(course.revenue || 0).toLocaleString()}
    </span>

  </div>

  <div className="flex items-center gap-2">

    <MdCategory className="text-pink-400" />

    <span className="text-richblack-100 font-medium">
      {course.category}
    </span>

  </div>

</div>

        <div className="mt-6 flex items-center justify-between  border-t border-richblack-700 pt-5">

          <span className="text-sm text-richblack-300">
            Price
          </span>

          <span className="text-lg font-bold text-yellow-50">
            ₹{(course.price || 0).toLocaleString()}
          </span>

        </div>

        {/* Buttons */}

        <div className="mt-8 grid grid-cols-3 gap-4">

          <button
            onClick={() => onView(course)}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 text-white transition-all hover:scale-105"
          >
            <FaEye />

            View
          </button>

          <button
            onClick={() => onEdit(course)}
            className="flex items-center justify-center gap-2 rounded-lg bg-green-500 py-2 text-white transition-all hover:scale-105"
          >
            <FaEdit />

            Edit
          </button>

          <button
            onClick={() => onAnalytics(course)}
            className="flex items-center justify-center gap-2 rounded-lg bg-purple-500 py-2 text-white transition-all hover:scale-105"
          >
            <FaChartLine />

            Analytics
          </button>

        </div>

      </div>
    </div>
  );
};

export default PublishedCourseCard;