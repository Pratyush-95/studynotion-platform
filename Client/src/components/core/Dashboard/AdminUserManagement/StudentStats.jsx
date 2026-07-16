import {
  FaUsers,
  FaCheckCircle,
  FaChartLine,
  FaBookReader,
} from "react-icons/fa";

const StudentStats = ({ students }) => {

  const totalStudents = students.length;

  const learningStudents = students.filter(
    (student) => student.status === "Learning"
  ).length;

  const completedStudents = students.filter(
    (student) => student.status === "Completed"
  ).length;

  const averageProgress =
    totalStudents === 0
      ? 0
      : Math.round(
          students.reduce(
            (total, student) =>
              total + student.progress,
            0
          ) / totalStudents
        );

  const cards = [
    {
      title: "Total Students",
      value: totalStudents,
      subtitle: "Enrolled Students",
      icon: (
        <FaUsers className="text-2xl text-blue-400" />
      ),
    },

    {
      title: "Learning",
      value: learningStudents,
      subtitle: "Currently Learning",
      icon: (
        <FaBookReader className="text-2xl text-yellow-400" />
      ),
    },

    {
      title: "Completed",
      value: completedStudents,
      subtitle: "Finished Course",
      icon: (
        <FaCheckCircle className="text-2xl text-green-400" />
      ),
    },

    {
      title: "Average Progress",
      value: `${averageProgress}%`,
      subtitle: "Overall Progress",
      icon: (
        <FaChartLine className="text-2xl text-pink-400" />
      ),
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

              <h2 className="mt-2 text-3xl font-bold text-richblack-5">

                {card.value}

              </h2>

            </div>

            <div className="rounded-full bg-richblack-700 p-3 transition-all duration-300 group-hover:scale-110">

              {card.icon}

            </div>

          </div>

          <div className="border-t border-richblack-700 pt-3">

            <p className="text-xs text-richblack-400">

              {card.subtitle}

            </p>

          </div>

        </div>

      ))}

    </div>

  );

};

export default StudentStats;