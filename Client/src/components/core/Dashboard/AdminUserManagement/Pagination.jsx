const Pagination = ({
  page,
  setPage,
  totalPages,
}) => {

  if (totalPages <= 1) return null;

  return (

    <div className="mt-8 flex items-center justify-center gap-5">

      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="rounded-md bg-richblack-700 px-5 py-2 disabled:opacity-50"
      >
        Previous
      </button>

      <span className="font-semibold">
        {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="rounded-md bg-yellow-50 px-5 py-2 text-black disabled:opacity-50"
      >
        Next
      </button>

    </div>

  );

};

export default Pagination;