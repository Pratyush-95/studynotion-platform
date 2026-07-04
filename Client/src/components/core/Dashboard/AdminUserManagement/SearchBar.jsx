import { FiSearch } from "react-icons/fi";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  onSearch,
}) => {

  return (

    <div className="flex w-full flex-col gap-4 sm:flex-row">

      <div className="relative flex-1">

        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-richblack-400"
        />

        <input
          type="text"
          placeholder="Search by Name, Email or User ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          className="w-full rounded-3xl border border-richblack-700 bg-richblack-900 py-4 pl-12 pr-4 text-richblack-5 outline-none transition duration-200 focus:border-yellow-50 focus:ring-2 focus:ring-yellow-50/20"
        />

      </div>

      <button
        onClick={onSearch}
        className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-yellow-50 to-yellow-200 px-8 py-4 text-sm font-semibold text-richblack-900 transition duration-200 hover:brightness-110"
      >
        Search
      </button>

    </div>

  );

};

export default SearchBar;