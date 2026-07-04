const SearchFilters = ({
  role,
  setRole,
}) => {

  return (

    <div className="flex flex-col gap-4 rounded-xl border border-richblack-700 bg-richblack-900 p-4 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-yellow-50/70">
          User Type
        </p>
        <p className="text-sm text-richblack-300">
          Filter students and instructors.
        </p>
      </div>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="min-w-[180px] rounded-3xl border border-richblack-700 bg-richblack-950 px-4 py-3 text-richblack-5 outline-none appearance-none transition duration-200 focus:border-yellow-50 focus:ring-2 focus:ring-yellow-50/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
        style={{ backgroundColor: "#020617", color: "#f8fafc" }}
      >
        <option value="all">All</option>
        <option value="Student">Student</option>
        <option value="Instructor">Instructor</option>
      </select>

    </div>

  );

};

export default SearchFilters;