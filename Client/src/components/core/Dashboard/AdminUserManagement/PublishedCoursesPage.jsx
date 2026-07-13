import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

import PublishedCourseStats from "./PublishedCourseStats";
import PublishedCourseFilters from "./PublishedCourseFilters";
import PublishedCourseCard from "./PublishedCourseCard";

//import { apiConnector } from "../../../services/apiConnector";
import { getPublishedCourses } from "../../../../services/operations/adminUserManagementAPI";

const PublishedCoursesPage = () => {

  const navigate = useNavigate();

  const { userId } = useParams();
  const { token } = useSelector((state) => state.auth);

  // ============================================
  // Loading
  // ============================================

  const [loading, setLoading] = useState(true);

  // ============================================
  // Courses
  // ============================================

  const [courses, setCourses] = useState([]);

  const [categories, setCategories] = useState([]);

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
  });

  // ============================================
  // Filters
  // ============================================

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [sortBy, setSortBy] = useState("Newest");

  // ============================================
  // Pagination
  // ============================================

  const [currentPage, setCurrentPage] = useState(1);

  const coursesPerPage = 6;

  // ============================================
  // Fetch Published Courses
  // ============================================

  const fetchPublishedCourses = async () => {

    try {

      setLoading(true);

      const response = await getPublishedCourses(
        token,
        userId
      );

      if (!response?.success) {
        throw new Error("Unable to fetch courses");
      }

      setCourses(response.courses || []);

      setStats(response.stats || {});

      setCategories(response.categories || []);

    }

    catch (error) {

      console.log(error);

      toast.error("Failed to load published courses");

    }

    finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchPublishedCourses();

  }, [userId]);

    // ==========================================================
  // Reset Filters
  // ==========================================================

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All");
    setSortBy("Newest");
    setCurrentPage(1);
  };

  // ==========================================================
  // Filter + Search + Sort
  // ==========================================================

  const filteredCourses = useMemo(() => {
    let data = [...courses];

    // -----------------------------
    // Search
    // -----------------------------

    if (search.trim()) {
      data = data.filter((course) =>
        course.courseName
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // -----------------------------
    // Category
    // -----------------------------

    if (category !== "All") {
      data = data.filter(
        (course) => course.category === category
      );
    }

    // -----------------------------
    // Sort
    // -----------------------------

    switch (sortBy) {
      case "Newest":
        data.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
        break;

      case "Oldest":
        data.sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
        );
        break;

      case "Highest Rating":
        data.sort(
          (a, b) =>
            (b.averageRating || 0) -
            (a.averageRating || 0)
        );
        break;

      case "Highest Revenue":
        data.sort(
          (a, b) =>
            (b.revenue || 0) -
            (a.revenue || 0)
        );
        break;

      case "Most Students":
        data.sort(
          (a, b) =>
            (b.studentsCount || 0) -
            (a.studentsCount || 0)
        );
        break;

      default:
        break;
    }

    return data;
  }, [courses, search, category, sortBy]);

  // ==========================================================
  // Pagination
  // ==========================================================

  const totalPages = Math.ceil(
    filteredCourses.length / coursesPerPage
  );

  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  // ==========================================================
  // Change Page
  // ==========================================================

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // ==========================================================
  // Card Actions
  // ==========================================================

  const handleView = (course) => {
    navigate(`/dashboard/course/${course._id}`);
  };

  const handleEdit = (course) => {
    navigate(`/dashboard/edit-course/${course._id}`);
  };

  const handleAnalytics = (course) => {
    navigate(`/dashboard/course/${course._id}/analytics`);
  };

  return (
  <div className="mx-auto w-11/12 max-w-7xl py-8">

    {/* Header */}

    <div className="mb-8 flex flex-col gap-3">

      <h1 className="text-3xl font-bold text-richblack-5">
        Published Courses
      </h1>

      <p className="text-richblack-300">
        View and manage all published courses of this instructor.
      </p>

    </div>

    {/* Stats */}

    <PublishedCourseStats
      stats={stats}
    />

    {/* Filters */}

    <div className="mt-8">

      <PublishedCourseFilters

        search={search}
        setSearch={setSearch}

        category={category}
        setCategory={setCategory}

        sortBy={sortBy}
        setSortBy={setSortBy}

        totalResults={filteredCourses.length}

        categories={categories}

        onReset={handleResetFilters}

      />

    </div>

    {/* Loading */}

    {loading ? (

      <div className="flex h-[350px] items-center justify-center">

        <div className="h-14 w-14 animate-spin rounded-full border-4 border-yellow-50 border-t-transparent"></div>

      </div>

    ) : filteredCourses.length === 0 ? (

      /* Empty */

      <div className="mt-16 flex flex-col items-center justify-center rounded-xl border border-richblack-700 bg-richblack-800 py-20">

        <h2 className="text-2xl font-semibold text-richblack-5">
          No Published Courses
        </h2>

        <p className="mt-2 text-richblack-400">
          This instructor has not published any course yet.
        </p>

      </div>

    ) : (

      <>
        {/* Cards */}

        <div className="mt-10 grid grid-cols-1 gap-6  md:grid-cols-2 xl:grid-cols-2">

          {currentCourses.map((course) => (

            <PublishedCourseCard

              key={course._id}

              course={course}

              onView={handleView}

              onEdit={handleEdit}

              onAnalytics={handleAnalytics}

            />

          ))}

        </div>

        {/* Pagination */}

        {totalPages > 1 && (

          <div className="mt-12 flex items-center justify-center gap-3">

            <button

              onClick={previousPage}

              disabled={currentPage === 1}

              className="rounded-lg bg-richblack-700 px-5 py-2 text-richblack-5 disabled:cursor-not-allowed disabled:opacity-40"

            >
              Previous
            </button>

            <span className="rounded-lg bg-yellow-50 px-5 py-2 font-semibold text-richblack-900">

              {currentPage} / {totalPages}

            </span>

            <button

              onClick={nextPage}

              disabled={currentPage === totalPages}

              className="rounded-lg bg-richblack-700 px-5 py-2 text-richblack-5 disabled:cursor-not-allowed disabled:opacity-40"

            >
              Next
            </button>

          </div>

        )}

      </>

    )}

  </div>
);

};

export default PublishedCoursesPage;