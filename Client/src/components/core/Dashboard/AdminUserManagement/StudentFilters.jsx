import { FaSearch, FaUndo } from "react-icons/fa";

const StudentFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  totalResults,
}) => {
  return (
    <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-5">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}

        <div className="relative w-full lg:w-[350px]">

          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-richblack-400" />

          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-richblack-600 bg-richblack-700 py-3 pl-11 pr-4 text-richblack-5 outline-none transition-all duration-300 focus:border-yellow-400"
          />

        </div>

        {/* Filters */}

        <div className="flex flex-wrap items-center gap-4">

          {/* Status */}

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-richblack-600 bg-richblack-700 px-4 py-3 text-richblack-5 outline-none focus:border-yellow-400"
          >

            <option value="All">
              All Status
            </option>

            <option value="Learning">
              Learning
            </option>

            <option value="Completed">
              Completed
            </option>

          </select>

          {/* Results */}

          <div className="rounded-lg bg-richblack-700 px-4 py-3 text-sm text-richblack-100">

            Total :
            <span className="ml-2 font-semibold text-yellow-50">

              {totalResults}

            </span>

          </div>

          {/* Reset */}

          <button
            onClick={() => {
              setSearch("");
              setStatus("All");
            }}
            className="flex items-center gap-2 rounded-lg bg-richblack-700 px-4 py-3 text-richblack-5 transition-all duration-300 hover:bg-yellow-50 hover:text-richblack-900"
          >

            <FaUndo />

            Reset

          </button>

        </div>

      </div>

    </div>
  );
};

export default StudentFilters;