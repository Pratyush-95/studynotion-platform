import { FiSearch } from "react-icons/fi";

const ActivitySearch = ({
  search,
  setSearch,
  filter,
  setFilter,
}) => {
  return (
    <div className="flex gap-4">

      <div className="relative flex-1">

        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-richblack-400"
          size={18}
        />

        <input
          type="text"
          placeholder="Search activities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-richblack-700 bg-richblack-800 py-3 pl-12 pr-4 text-richblack-5 outline-none transition focus:border-yellow-50"
        />

      </div>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="rounded-xl border border-richblack-700 bg-richblack-800 px-5 text-richblack-5 outline-none focus:border-yellow-50"
      >
        <option>All</option>
        <option>Payment</option>
        <option>Course</option>
        <option>Support</option>
        <option>Notification</option>
      </select>

    </div>
  );
};

export default ActivitySearch;