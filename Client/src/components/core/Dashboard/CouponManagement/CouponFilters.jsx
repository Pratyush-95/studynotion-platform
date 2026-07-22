import { FiSearch } from "react-icons/fi";

function CouponFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
}) {
  return (
    <div className="mt-8 rounded-xl border border-richblack-700 bg-richblack-800 p-5">

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Search */}

        <div className="relative">

          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-richblack-300" />

          <input
            type="text"
            placeholder="Search coupon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-richblack-600 bg-richblack-700 py-3 pl-12 pr-4 text-richblack-5 outline-none transition-all duration-200 focus:border-yellow-50"
          />

        </div>

        {/* Status */}

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-richblack-600 bg-richblack-700 px-4 text-richblack-5 outline-none focus:border-yellow-50"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Discount Type */}

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-richblack-600 bg-richblack-700 px-4 text-richblack-5 outline-none focus:border-yellow-50"
        >
          <option value="All">All Types</option>
          <option value="PERCENTAGE">Percentage</option>
          <option value="FIXED">Fixed</option>
        </select>

      </div>

    </div>
  );
}

export default CouponFilters;