import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { getInstructorStudents } from "../../../../services/operations/adminUserManagementAPI";

import StudentStats from "./StudentStats";
import StudentFilters from "./StudentFilters";
import StudentTable from "./StudentTable";

const InstructorStudentsPage = () => {

  const { userId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 10;

  // ============================================
  // Fetch Students
  // ============================================

  const fetchStudents = async () => {

    try {

      setLoading(true);

      const response = await getInstructorStudents(
        token,
        userId
      );

      if (!response?.success) {
        throw new Error("Unable to fetch students");
      }

      setStudents(response.students || []);

    }

    catch (error) {

      console.log(error);

      toast.error("Unable to load students");

    }

    finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchStudents();

  }, [userId]);

  // ============================================
  // Filter
  // ============================================

  const filteredStudents = useMemo(() => {

    let data = [...students];

    if (search.trim()) {

      data = data.filter(
        (student) =>
          student.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||

          student.email
            .toLowerCase()
            .includes(search.toLowerCase())
      );

    }

    if (status !== "All") {

      data = data.filter(
        (student) => student.status === status
      );

    }

    return data;

  }, [students, search, status]);

  // ============================================
  // Pagination
  // ============================================

  const totalPages = Math.ceil(
    filteredStudents.length / studentsPerPage
  );

  const currentStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  // ============================================

  return (

    <div className="mx-auto w-[98%] max-w-[1500px] space-y-8 py-4">

      {/* Header */}

      <div className="border-b border-richblack-700 pb-6">

        <h1 className="text-4xl font-bold text-richblack-5">

          Enrolled Students

        </h1>

        <p className="mt-2 text-richblack-300">

          View all students enrolled in this instructor's courses.

        </p>

      </div>

      {/* Stats */}

      <StudentStats students={students} />

      {/* Filters */}

      <StudentFilters

        search={search}
        setSearch={setSearch}

        status={status}
        setStatus={setStatus}

        totalResults={filteredStudents.length}

      />

      {/* Loading */}

      {loading ? (

        <div className="flex h-[250px] items-center justify-center">

          <div className="h-14 w-14 animate-spin rounded-full border-4 border-yellow-50 border-t-transparent"></div>

        </div>

      ) : filteredStudents.length === 0 ? (

        <div className="rounded-2xl border border-richblack-700 bg-richblack-800 py-20 text-center">

          <div className="text-6xl">

            👨‍🎓

          </div>

          <h2 className="mt-4 text-3xl font-bold text-richblack-5">

            No Students Found

          </h2>

          <p className="mt-2 text-richblack-300">

            No students are enrolled in this instructor's courses.

          </p>

        </div>

      ) : (

        <>

          <StudentTable students={currentStudents} />

          {/* Pagination */}

          {totalPages > 1 && (

            <div className="flex items-center justify-center gap-4">

              <button

                disabled={currentPage === 1}

                onClick={() =>
                  setCurrentPage((prev) => prev - 1)
                }

                className="rounded-lg bg-richblack-700 px-5 py-2 text-richblack-5 transition-all hover:bg-yellow-50 hover:text-richblack-900 disabled:opacity-40"

              >

                Previous

              </button>

              <span className="rounded-lg bg-yellow-50 px-5 py-2 font-semibold text-richblack-900">

                {currentPage} / {totalPages}

              </span>

              <button

                disabled={currentPage === totalPages}

                onClick={() =>
                  setCurrentPage((prev) => prev + 1)
                }

                className="rounded-lg bg-richblack-700 px-5 py-2 text-richblack-5 transition-all hover:bg-yellow-50 hover:text-richblack-900 disabled:opacity-40"

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

export default InstructorStudentsPage;