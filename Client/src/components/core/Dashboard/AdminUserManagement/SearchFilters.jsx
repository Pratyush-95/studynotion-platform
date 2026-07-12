const SearchFilters = ({
  role,
  setRole,
}) => {

 return (
  <div className="w-[320px] rounded-xl border border-richblack-700 bg-richblack-900 px-6 py-5">

    <p className="text-xs uppercase tracking-[0.25em] text-yellow-50">
      USER TYPE
    </p>

    <p className="mt-2 text-sm text-richblack-400">
      Filter students and instructors.
    </p>

    <select
      value={role}
      onChange={(e) => setRole(e.target.value)}
      className="mt-5 h-12 w-full rounded-xl border border-richblack-700 bg-richblack-950 px-4 text-richblack-5 outline-none focus:border-yellow-50"
    >
      <option value="all">All</option>
      <option value="Student">Student</option>
      <option value="Instructor">Instructor</option>
    </select>

  </div>
)

};

export default SearchFilters;