import { FiDownload, FiCalendar } from "react-icons/fi";

const ActivityHeader = ({ activityCount }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-yellow-50">
          All Activities
        </h1>

        <p className="mt-2 text-richblack-300">
          {activityCount}
        </p>
      </div>

      <div className="flex gap-3">
        <button className="flex items-center gap-2 rounded-lg border border-richblack-700 bg-richblack-800 px-4 py-2 text-sm text-richblack-5 transition hover:border-yellow-50">
          <FiDownload />
          Export
        </button>

        <button className="flex items-center gap-2 rounded-lg border border-richblack-700 bg-richblack-800 px-4 py-2 text-sm text-richblack-5 transition hover:border-yellow-50">
          <FiCalendar />
          Last 30 Days
        </button>
      </div>
    </div>
  );
};

export default ActivityHeader;