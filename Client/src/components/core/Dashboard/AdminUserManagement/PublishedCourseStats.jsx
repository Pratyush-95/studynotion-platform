import {
  FaBookOpen,
  FaUsers,
  FaRupeeSign,
  FaStar,
} from "react-icons/fa";

const PublishedCourseStats = ({ stats }) => {
  const cards = [
    {
      title: "Published Courses",
      value: stats?.totalCourses || 0,
      icon: <FaBookOpen className="text-2xl text-yellow-400" />,
      subtitle: "Live Courses",
    },
    {
      title: "Students",
      value: stats?.totalStudents || 0,
      icon: <FaUsers className="text-2xl text-blue-400" />,
      subtitle: "Total Enrolled",
    },
    {
      title: "Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: <FaRupeeSign className="text-2xl  text-caribbeangreen-100" />,
      subtitle: "Total Earnings",
    },
    {
      title: "Average Rating",
      value: stats?.averageRating
        ? stats.averageRating.toFixed(1)
        : "0.0",
      icon: <FaStar className="text-2xl text-pink-400" />,
      subtitle: "Course Rating",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="group rounded-xl border border-richblack-700 bg-richblack-800 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400 hover:shadow-lg"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-richblack-300">
                {card.title}
              </p>

              <h2
                className={`mt-2 text-3xl font-bold ${
                card.title === "Revenue"
                ?"text-caribbeangreen-100"
                : "text-richblack-5"}`}>
                {card.value}
              </h2>
            </div>

            <div className="rounded-full bg-richblack-700 p-3 transition-all duration-300 group-hover:scale-110">
                {card.icon}
            </div>
        </div>

        <div className="border-t border-richblack-700 pt-3">

  {card.title === "Average Rating" && (
    <div className="mb-2 flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={
            star <= Math.round(stats?.averageRating || 0)
              ? "text-yellow-400"
              : "text-richblack-600"
          }
        />
      ))}
    </div>
  )}

  <p className="text-xs text-richblack-400">
    {card.subtitle}
  </p>

</div>
        </div>
      ))}
    </div>
  );
};

export default PublishedCourseStats;