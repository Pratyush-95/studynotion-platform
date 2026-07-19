import { FaCheckCircle } from "react-icons/fa";

const StudentTable = ({ students }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800">

      <div className="overflow-x-auto">

        <table className="w-full ">

          {/* Header */}

          <thead className="bg-richblack-700">

            <tr>

              <th className="w-[280px] px-6 py-4 text-left text-sm font-semibold text-richblack-5">
                Student
              </th>

              <th className="w-[320px] px-8 py-5 text-left text-sm font-semibold text-richblack-5">
                Email
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-richblack-5">
                Course
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-richblack-5">
                Progress
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-richblack-5">
                Enrolled
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-richblack-5">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {students.map((student) => (

              <tr
                key={`${student._id}-${student.course}`}
                className="border-t border-richblack-700 transition-all duration-300 hover:bg-richblack-700"
              >

                {/* Student */}

                <td className="w-[300px] px-6 py-5">

                  <div className="flex items-center gap-3">

                    <img
                      src={
                        student.image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          student.name
                        )}&background=0D8ABC&color=fff`
                      }
                      alt={student.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />

                    <div>

                      <h3 className="font-semibold text-richblack-5">
                        {student.name}
                      </h3>

                    </div>

                  </div>

                </td>

                {/* Email */}

                <td className="w-[320px] px-8 py-6 text-richblack-300">

                  {student.email}

                </td>

                {/* Course */}

                <td className="px-6 py-5 text-richblack-100">

                  {student.course}

                </td>

                {/* Progress */}

                <td className="px-6 py-5">

                  <div className="flex flex-col gap-2">

                    <div className="flex justify-between">

                      <span className="text-sm text-richblack-300">

                        {student.progress}%

                      </span>

                    </div>

                    <div className="h-2 w-[150px] rounded-full bg-richblack-600">

                      <div
                        className={`h-2 rounded-full ${
                          student.progress === 100
                            ? "bg-green-400"
                            : "bg-yellow-400"
                        }`}
                        style={{
                          width: `${student.progress}%`,
                        }}
                      />

                    </div>

                  </div>

                </td>

                {/* Date */}

                <td className="px-6 py-5 text-richblack-300">

                  {new Date(
                    student.enrolledDate
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}

                </td>

                {/* Status */}

                <td className="px-6 py-5">

                  {student.status === "Completed" ? (

                    <span className="flex w-fit items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold bg-caribbeangreen-100">

                      <FaCheckCircle />

                      Completed

                    </span>

                  ) : (

                    <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-sm font-semibold text-yellow-300">

                      Learning

                    </span>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default StudentTable;