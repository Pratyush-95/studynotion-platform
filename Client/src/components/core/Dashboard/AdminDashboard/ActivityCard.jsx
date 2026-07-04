import {
  FiBell,
  FiBook,
  FiDollarSign,
  FiMessageSquare,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiGlobe,
  FiMonitor,
  FiClock,
  FiMoreVertical,
  FiShield,
} from "react-icons/fi";

// ----------------------
// Helper Functions
// ----------------------

const formatTitle = (value) => {
  if (!value) return "Activity";

  return value
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
};

const formatDate = (value) => {
  const date = new Date(value);

  if (isNaN(date.getTime()))
    return "Recently";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getActivityIcon = (activity) => {
  const type = activity?.type?.toUpperCase();
  const subType = activity?.subType?.toUpperCase();

  if (type === "PAYMENT")
    return (
      <FiDollarSign className="text-2xl text-green-400" />
    );

  if (type === "COURSE")
    return (
      <FiBook className="text-2xl text-violet-400" />
    );

  if (type === "SUPPORT")
    return (
      <FiMessageSquare className="text-2xl text-yellow-400" />
    );

  if (type === "NOTIFICATION") {
    switch (subType) {
      case "ACCOUNT_ACTIVATED":
        return (
          <FiCheckCircle className="text-2xl text-green-400" />
        );

      case "ACCOUNT_DEACTIVATED":
        return (
          <FiXCircle className="text-2xl text-red-400" />
        );

      case "PROFILE_UPDATED":
        return (
          <FiUser className="text-2xl text-blue-400" />
        );

      default:
        return (
          <FiBell className="text-2xl text-yellow-400" />
        );
    }
  }

  return (
    <FiBell className="text-2xl text-yellow-400" />
  );
};

const getBadgeColor = (type) => {
  switch (type?.toUpperCase()) {

    case "PAYMENT":
      return "border border-caribbeangreen-100 bg-caribbeangreen-100/15 text-caribbeangreen-100";

    case "COURSE":
      return "border border-blue-100 bg-blue-100/15 text-blue-100";

    case "SUPPORT":
      return "border border-yellow-50 bg-yellow-50/15 text-yellow-50";

    case "NOTIFICATION":
      return "border border-richblue-100 bg-richblue-100/15 text-richblue-100";

    default:
      return "border border-richblack-600 bg-richblack-700 text-richblack-25";
  }
};

// ----------------------------------

const ActivityCard = ({ activity }) => {

  return (

    <div className="group relative overflow-hidden rounded-2xl border border-richblack-700/40 bg-gradient-to-br from-richblack-900 via-[#171D2B] to-[#111827] px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] hover:border-yellow-400   hover:shadow-[0_25px_60px_rgba(250,204,21,0.15)]">
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-yellow-400 via-blue-400 to-violet-500 opacity-80"></div>
      <div className="flex items-start justify-between gap-5">

        {/* LEFT */}

        <div className="flex gap-4">

          <div className="relative">

  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/30 via-blue-500/20 to-violet-500/30 blur-xl opacity-0 transition duration-300 group-hover:opacity-100"></div>

  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-richblack-600 bg-gradient-to-br from-richblack-700 via-richblack-800 to-richblack-900 shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:border-yellow-400">

    {getActivityIcon(activity)}

  </div>

</div>

          <div>

            <div className="flex items-center gap-2 flex-wrap">

              <h2 className="text-xl font-bold  text-richblack-5">

                {formatTitle(activity?.title)}

              </h2>

              <span
                className={`rounded-xl  border px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider ${getBadgeColor(
                  activity?.type
                )}`}
              >
                {activity?.type || "Notification"}
              </span>

            </div>

            <p className="mt-1 text-sm text-richblack-300 line-clamp-2 leading-6">

              {activity?.message ||
                "No description available."}

            </p>

            {/* -------- Metadata Row -------- */}

            <div className="mt-3 grid grid-cols-4 gap-x-5 gap-y-2 text-xs text-richblack-400">

              <div className="flex items-center gap-2">

                <FiUser />

                {activity?.performedBy?.firstName || "Unknown User"}

              </div>

              <div className="flex items-center gap-2">

                <FiShield />

                {activity?.performedBy?.accountType ||
                  "Student"}

              </div>

              <div className="flex items-center gap-2">

                <FiMonitor />

                {activity?.browser || "Unknown Browser"}

              </div>

              <div className="flex items-center gap-2">

                <FiGlobe />

                {activity?.ipAddress || "::1"}

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}

                <div className="flex flex-col items-end gap-2">

          {/* Time */}

          <div className="flex items-center gap-2 text-xs text-richblack-400">

            <FiClock />

            {formatDate(activity?.createdAt)}

          </div>

          {/* Status */}

          <span
  className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${
    activity?.status === "SUCCESS" ||
    activity?.status === "ACTIVE"
      ? "border-caribbeangreen-100 bg-caribbeangreen-100/15 text-caribbeangreen-100"

      : activity?.status === "FAILED" ||
        activity?.status === "REJECTED"

      ? "border-pink-200 bg-pink-200/15 text-pink-200"

      : activity?.status === "UNREAD"

      ? "border-yellow-50 bg-yellow-50/15 text-yellow-50"

      : "border-blue-100 bg-blue-100/15 text-blue-100"
  }`}
>
  {activity?.status || "Completed"}
</span>

          {/* Three Dot Button */}

          <button
            className="rounded-xl border bg-richblack-800  border-richblack-700 p-1.5 text-richblack-300 transition hover:border-yellow-50 hover:text-yellow-50"
          >
            <FiMoreVertical size={16} />
          </button>

        </div>

      </div>

      {/* Bottom Divider */}

      <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-richblack-600 to-transparent"></div>

      {/* Footer */}

      <div className="flex items-center justify-between text-xs">

        <div className="flex flex-wrap gap-3">

          <span className="rounded-xl border border-richblack-700 bg-richblack-800 px-3 py-1 text-richblack-200">
            ID : {activity?._id?.slice(-6) || "------"}
          </span>

          {activity?.performedBy?.email && (
            <span className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-blue-300">
              {activity.performedBy.email}
            </span>
          )}

        </div>

        <div className="font-medium text-richblack-300">

          Last Updated :
          {" "}
          {formatDate(activity?.updatedAt || activity?.createdAt)}

        </div>

      </div>

    </div>

  );

};

export default ActivityCard;