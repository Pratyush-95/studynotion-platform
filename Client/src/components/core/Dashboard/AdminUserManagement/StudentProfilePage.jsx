import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { viewUserProfile } from "../../../../services/operations/adminUserManagementAPI";


const StudentProfilePage= () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useSelector((state) => state.auth);

    const fetchStudentProfile = async () => {
  setLoading(true);

  const response = await viewUserProfile(token, userId);

  if (response?.success) {
    setUser(response.data);
  }

  setLoading(false);
};

useEffect(() => {
  if (!token || !userId) return;

  fetchStudentProfile();
}, [token, userId]);

    const basic = user?.basicInformation;
    const profile = user?.profileInformation;
    const stats = user?.statistics;

    useEffect(() => {
    fetchStudentProfile();
    }, [userId]);


    if (loading) {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      Loading...
    </div>
  );
}

if (!user) {
  return (
    <div className="flex h-[80vh] items-center justify-center text-richblack-5">
      User not found
    </div>
  );
}

 return (
  <div className="w-full px-8 pt-2 pb-8">
    <div className="mx-auto max-w-7xl">

      {/* ================= USER PROFILE ================= */}

      <div className="flex flex-col justify-between gap-6 rounded-2xl border border-richblack-700 bg-[#0d0f18] p-6 shadow-xl sm:flex-row sm:items-center">

        <div className="flex items-center gap-5">

          <div className="overflow-hidden rounded-2xl border border-richblack-700">

            <img
              src={
                basic.image ||
                `https://api.dicebear.com/5.x/initials/svg?seed=${basic.firstName}+${basic.lastName}`
              }
              alt={`${basic.firstName} ${basic.lastName}`}
              className="h-28 w-28 object-cover"
            />

          </div>

          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-yellow-100/70">
              User Profile
            </p>

            <h1 className="mt-2 text-3xl font-bold text-richblack-5">
              {basic.firstName} {basic.lastName}
            </h1>

            <p className="mt-2 text-richblack-300">
              {basic.email}
            </p>

          </div>

        </div>

        <div className="flex flex-wrap gap-3">

          <span className="rounded-xl bg-richblack-800 px-4 py-2 font-semibold text-richblack-50">
            {basic.accountType}
          </span>

          <span
            className={`rounded-xl px-4 py-2 font-semibold ${
              basic.active
                ? "bg-caribbeangreen-100 text-richblack-900"
                : "bg-pink-100 text-richblack-5"
            }`}
          >
            {basic.active ? "Active" : "Blocked"}
          </span>

        </div>

      </div>

      {/* ================= ENROLLED COURSE ================= */}

      <section className="mt-8 rounded-2xl border border-richblack-700 bg-richblack-950/80 p-6">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-yellow-50">
            Enrolled Courses
          </h2>

          <span className="rounded-full bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-50">
            {user.courses?.length || 0} Courses
          </span>

        </div>

        <div className="grid gap-5">

          {user.courses?.map((course) => (

            <div
              key={course.id}
              className="rounded-xl border border-richblack-700 bg-richblack-900 p-5 transition-all duration-300 hover:border-yellow-400"
            >

              <h3 className="text-xl font-bold text-richblack-5">
                {course.courseName}
              </h3>

              <p className="mt-3 text-richblack-300">
                Instructor :

                <span className="ml-2 font-semibold text-yellow-50">
                  {course.instructorName || "Unknown"}
                </span>

              </p>

            </div>

          ))}

        </div>

      </section>

      {/* ================= MAIN GRID ================= */}

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-start">

        {/* LEFT SIDE */}

        <div className="space-y-8 self-start">

      {/* ================= BASIC INFORMATION ================= */}

<section className="rounded-2xl border border-richblack-700 bg-richblack-950/80 p-6  h-fit">

  <h3 className="mb-5 text-2xl font-bold text-yellow-50">
    Basic Information
  </h3>

  <div className="grid gap-4 sm:grid-cols-2">

    <div className="rounded-xl bg-richblack-900 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">
        Joined
      </p>

      <p className="mt-2 text-richblack-5">
        {new Date(basic.joinedOn).toLocaleDateString()}
      </p>
    </div>

    <div className="rounded-xl bg-richblack-900 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">
        Approval
      </p>

      <p className="mt-2 text-richblack-5">
        {basic.approvalStatus}
      </p>
    </div>

    <div className="rounded-xl bg-richblack-900 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">
        Browser
      </p>

      <p className="mt-2 text-richblack-5">
        {basic.browser || "-"}
      </p>
    </div>

    <div className="rounded-xl bg-richblack-900 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">
        IP Address
      </p>

      <p className="mt-2 text-richblack-5">
        {basic.ipAddress || "-"}
      </p>
    </div>

  </div>

</section>

{/* LEFT SIDE CONTINUE */}

<section className="rounded-2xl border border-richblack-700 bg-richblack-950/80 p-6">

  <h3 className="mb-5 text-2xl font-bold text-yellow-50">
    Profile Information
  </h3>

  <div className="grid gap-4 sm:grid-cols-2">

    <div className="rounded-xl bg-richblack-900 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">
        Phone
      </p>

      <p className="mt-2 text-richblack-5">
        {profile.contactNumber || "-"}
      </p>
    </div>

    <div className="rounded-xl bg-richblack-900 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">
        Gender
      </p>

      <p className="mt-2 text-richblack-5">
        {profile.gender || "-"}
      </p>
    </div>

    <div className="rounded-xl bg-richblack-900 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">
        Date of Birth
      </p>

      <p className="mt-2 text-richblack-5">
        {profile.dateOfBirth || "-"}
      </p>
    </div>

    <div className="rounded-xl bg-richblack-900 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">
        About
      </p>

      <p className="mt-2 text-richblack-5">
        {profile.about || "-"}
      </p>
    </div>

  </div>

</section>

</div>

{/* ================= RIGHT SIDE ================= */}

<aside className="space-y-8">

<section className="rounded-2xl border border-richblack-700 bg-richblack-950/80 p-6">

  <h3 className="mb-5 text-2xl font-bold text-yellow-50">
    Statistics
  </h3>

  <div className="grid gap-4">

    <div className="rounded-xl bg-richblack-900 p-5">
      <p className="text-richblack-400">
        Enrolled Courses
      </p>

      <h2 className="mt-3 text-4xl font-bold text-yellow-50">
        {stats.enrolledCourses}
      </h2>
    </div>

    <div className="rounded-xl bg-richblack-900 p-5">
      <p className="text-richblack-400">
        Total Orders
      </p>

      <h2 className="mt-3 text-4xl font-bold text-yellow-50">
        {stats.totalOrders}
      </h2>
    </div>

    <div className="rounded-xl bg-richblack-900 p-5">
      <p className="text-richblack-400">
        Total Spent
      </p>

      <h2 className="mt-3 text-4xl font-bold text-yellow-50">
        ₹{stats.totalSpent}
      </h2>
    </div>

  </div>

</section>

{/* ================= ACTIVITY ================= */}

<section className="rounded-2xl border border-richblack-700 bg-richblack-950/80 p-6">

  <h3 className="mb-5 text-2xl font-bold text-yellow-50">
    Activity
  </h3>

  <div className="space-y-4">

    <div className="rounded-xl bg-richblack-900 p-5">

      <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">
        Recent Login
      </p>

      <p className="mt-2 text-richblack-5">
        {basic.lastLogin
          ? new Date(basic.lastLogin).toLocaleString()
          : "-"}
      </p>

    </div>

    <div className="rounded-xl bg-richblack-900 p-5">

      <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">
        Recent Logout
      </p>

      <p className="mt-2 text-richblack-5">
        {basic.lastLogout
          ? new Date(basic.lastLogout).toLocaleString()
          : "-"}
      </p>

    </div>

  </div>

</section>

</aside>

{/* ================= END OF MAIN GRID ================= */}

</div>

{/* ================= NOTIFICATIONS & SUPPORT ================= */}

<div className="mt-8 grid gap-6 lg:grid-cols-2">

  {/* Notifications */}

  <section className="rounded-2xl border border-richblack-700 bg-richblack-950/80 p-6">

    <h3 className="mb-5 text-2xl font-bold text-yellow-50">
      Notifications ({user.notifications?.length || 0})
    </h3>

    <div className="space-y-3">

      {user.notifications?.length ? (

        user.notifications.map((notification) => (

          <div
            key={notification.id}
            className="rounded-xl bg-richblack-900 p-4"
          >

            <h4 className="font-semibold text-richblack-5">
              {notification.title}
            </h4>

            <p className="mt-2 text-sm text-richblack-300">
              {notification.message}
            </p>

          </div>

        ))

      ) : (

        <p className="text-richblack-400">
          No Notifications Found
        </p>

      )}

    </div>

  </section>

  {/* Support Ticket starts below */}
  {/* ================= SUPPORT TICKETS ================= */}

<section className="rounded-2xl border border-richblack-700 bg-richblack-950/80 p-6">

  <h3 className="mb-5 text-2xl font-bold text-yellow-50">
    Support Tickets ({user.supportTickets?.length || 0})
  </h3>

  <div className="space-y-3">

    {user.supportTickets?.length ? (

      user.supportTickets.map((ticket) => (

        <div
          key={ticket.id}
          className="rounded-xl bg-richblack-900 p-4"
        >

          <h4 className="font-semibold text-richblack-5">
            {ticket.subject}
          </h4>

          <p className="mt-2 text-sm text-richblack-300">
            Status :
            <span
              className={`ml-2 font-semibold ${
                ticket.status === "Resolved"
                  ? "text-green-400"
                  : ticket.status === "Pending"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {ticket.status}
            </span>
          </p>

        </div>

      ))

    ) : (

      <p className="text-richblack-400">
        No Support Tickets Found
      </p>

    )}

  </div>

</section>

</div>

</div>

</div>

);
};

export default StudentProfilePage;