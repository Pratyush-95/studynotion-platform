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
  className="
    h-14
    w-full
    rounded-xl
    border
    border-richblack-700
    bg-richblack-900
    pl-12
    pr-5
    text-base
    text-richblack-5
    outline-none
    transition-all
    focus:border-yellow-50
    focus:ring-2
    focus:ring-yellow-500/20
  "
/>

      </div>

      <button
        onClick={onSearch}
       className="h-14 min-w-[150px] rounded-xl bg-yellow-50 text-richblack-900 font-semibold transition-all hover:bg-yellow-100 "
      >
        Search
      </button>

    </div>

  );

};

export default SearchBar;