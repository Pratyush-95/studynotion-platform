import { FaSearch, FaSyncAlt, FaFilter } from "react-icons/fa";

const PublishedCourseFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  sortBy,
  setSortBy,
  totalResults,
  onReset,
  categories = [],
}) => {
  return (
    <div className="mt-6 rounded-xl border border-richblack-700 bg-richblack-800 p-5">

      {/* Header */}

      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

  <div className="flex items-center gap-2">

    <FaFilter className="text-yellow-400" />

    <h2 className="text-xl font-semibold text-richblack-5">
      Published Courses
    </h2>

  </div>

  <p className="rounded-full bg-richblack-700 px-4 py-2 text-sm text-richblack-200">

    Showing

    <span className="mx-2 font-bold text-yellow-300">
      {totalResults}
    </span>

    Courses

  </p>

</div>

      {/* Filters */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* Search */}

        <div className="relative">

          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-richblack-400" />

          <input
            type="text"
            placeholder="Search Course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-richblack-600 bg-richblack-700 py-3 pl-11 pr-4 text-richblack-5 outline-none transition-all focus:border-yellow-400"
          />

        </div>

        {/* Category */}

        <div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-richblack-600 bg-richblack-700 p-3 text-richblack-5 outline-none focus:border-yellow-400"
          >
            <option value="All">
              All Categories
            </option>

            {categories.map((cat) => (
              <option
                key={cat._id}
                value={cat.name}
              >
                {cat.name}
              </option>
            ))}

          </select>

        </div>

        {/* Sort */}

        <div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-lg border border-richblack-600 bg-richblack-700 p-3 text-richblack-5 outline-none focus:border-yellow-400"
          >
            <option value="Newest">
              Newest
            </option>

            <option value="Oldest">
              Oldest
            </option>

            <option value="Highest Rating">
              Highest Rating
            </option>

            <option value="Highest Revenue">
              Highest Revenue
            </option>

            <option value="Most Students">
              Most Students
            </option>

          </select>

        </div>

        {/* Reset */}

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 rounded-lg bg-yellow-50 px-5 py-3 font-semibold text-richblack-900 transition-all  duration-300 hover:scale-105 hover:bg-yellow-100"
        >
          <FaSyncAlt />

          Reset Filters

        </button>

      </div>

    </div>
  );
};

export default PublishedCourseFilters;