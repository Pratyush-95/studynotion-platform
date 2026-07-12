import { Link } from "react-router-dom";
import {
  FiBell,
  FiCheckCircle,
  FiXCircle,
  FiBook,
  FiDollarSign,
  FiMessageSquare,
} from "react-icons/fi";
import { HiOutlinePencilSquare } from "react-icons/hi2";



const getActivityIcon = (activity) => {
  const type = activity?.type?.toUpperCase();
  const subType = activity?.subType?.toUpperCase();

  if (type === "PAYMENT")
    return <FiDollarSign className="text-2xl text-caribbeangreen-100" />;

  if (type === "COURSE")
    return <FiBook className="text-2xl text-blue-100" />;

  if (type === "SUPPORT")
    return <FiMessageSquare className="text-2xl text-yellow-50" />;

  if (type === "NOTIFICATION") {
    switch (subType) {
      case "ACCOUNT_ACTIVATED":
        return <FiCheckCircle className="text-2xl text-caribbeangreen-100" />;

      case "ACCOUNT_DEACTIVATED":
        return <FiXCircle className="text-2xl text-pink-200" />;

      case "PROFILE_UPDATED":
         return (
    <HiOutlinePencilSquare className="text-[26px] text-richblue-100" />
  );

      default:
        return <FiBell className="text-2xl text-yellow-50" />;
    }
  }

  return <FiBell className="text-2xl text-yellow-50" />;
};
const RecentActivities = ({ activities }) => {
  return (
    <div className="rounded-xl border border-richblack-700 bg-richblack-900 p-6 min-h-[430px] max-h-[430px] flex flex-col">

      <div className="mb-6 flex items-center justify-between border-b border-richblack-700 pb-4">
        <h2 className="text-xl font-semibold text-yellow-50">
          Recent Activities
        </h2>


        <Link
        to="/dashboard/all-activities"
        className="flex items-center gap-1 text-sm font-semibold text-yellow-50 transition-all duration-300 hover:gap-2 hover:text-yellow-25"
        >
          View All →
          </Link>
      </div>

      {activities.length === 0 ? (
        <p className="flex flex-1 items-center justify-center text-richblack-400">
          No recent activities found.
        </p>
      ) : (
        <div className="space-y-3 overflow-y-auto pr-2 flex-1">
          {activities.slice(0, 4).map((activity, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-richblack-700 bg-gradient-to-r from-richblack-800 to-richblack-900 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-50 hover:shadow-lg hover:shadow-yellow-500/10"
            >
              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-richblack-600 bg-richblack-700">
                  {getActivityIcon(activity)}
                </div>

                <div className="flex-1">

                  <h3 className="line-clamp-1 text-base font-semibold text-richblack-5">
                     {activity.title
                     ?.split(" ")
                     .map((word) =>
                      word.charAt(0).toUpperCase() +
                     word.slice(1).toLowerCase()
                    )
                    .join(" ")}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-sm text-richblack-300">
                    {activity.message}
                  </p>

                  <p className="mt-2 text-xs text-richblack-300">
                    {new Date(activity.createdAt).toLocaleString("en-IN", {
                       day: "numeric",
                       month: "short",
                       hour: "numeric",
                       minute: "2-digit",
                   })}
                  </p>

                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivities;