const StatCard = ({ title, value, icon, color }) => {
 const colors = {
  blue:
    "bg-richblue-100/10 border-richblue-100/30",

  green:
    "bg-caribbeangreen-100/10 border-caribbeangreen-100/30",

  purple:
    "bg-blue-100/10 border-blue-100/30",

  yellow:
    "bg-yellow-50/10 border-yellow-50/30",
};
  return (
    <div
      className={`rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] ${colors[color]}`}
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-richblack-300">

            {title}

          </p>

          <h2 className="mt-2 text-4xl font-bold text-richblack-5">

            {value}

          </h2>

        </div>

        <div
        className={`rounded-xl p-3 text-3xl ${
            color === "blue"
            ? "bg-richblue-100/20 text-richblue-5"
            : color === "green"
            ? "bg-caribbeangreen-100/20 text-caribbeangreen-5"
            : color === "purple"
            ? "bg-blue-100/20 text-blue-5"
            : "bg-yellow-50/20 text-yellow-5"
            }`}
            >
                {icon}
        </div>

      </div>

    </div>
  );
};

const ActivityStats = ({ stats, icons }) => {
  return (
    <div className="grid grid-cols-4 gap-4">

      <StatCard
        title="Notifications"
        value={stats.notification}
        icon={icons.notification}
        color="blue"
      />

      <StatCard
        title="Payments"
        value={stats.payment}
        icon={icons.payment}
        color="green"
      />

      <StatCard
        title="Courses"
        value={stats.course}
        icon={icons.course}
        color="purple"
      />

      <StatCard
        title="Support"
        value={stats.support}
        icon={icons.support}
        color="yellow"
      />

    </div>
  );
};

export default ActivityStats;