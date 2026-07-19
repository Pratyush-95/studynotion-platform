export default function CourseFilters({
  search,
  setSearch,
  filter,
  setFilter,
}) {
  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-5 justify-between">

      {/* Search */}

      <input
        type="text"
        placeholder="Search Course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full lg:w-[420px] rounded-lg
        bg-richblack-800
        border border-richblack-700
        px-4 py-3
        text-richblack-5
        outline-none
        focus:border-yellow-50"
      />

      {/* Filter */}

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full lg:w-56
        rounded-lg
        bg-richblack-800
        border border-richblack-700
        px-4 py-3
        text-richblack-5
        outline-none
        focus:border-yellow-50"
      >
        <option value="All">All</option>

        <option value="Pending">
          Pending
        </option>

        <option value="Published">
          Approved
        </option>

        <option value="Rejected">
          Rejected
        </option>

      </select>

    </div>
  );
}