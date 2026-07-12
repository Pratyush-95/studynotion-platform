import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PendingCoursesModal from "./PendingCoursesModal";
import RejectedCoursesModal from "./RejectedCoursesModal";
//import DraftCoursesModal from "./DraftCoursesModal";

import { viewUserProfile } from "../../../../services/operations/adminUserManagementAPI";

const InstructorProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [showRejectedModal, setShowRejectedModal] = useState(false);
    const [showDraftModal, setShowDraftModal] = useState(false);

    useEffect(() => {

  const fetchUser = async () => {

    setLoading(true);

    const response = await viewUserProfile(token, userId);
    // console.log("Ye Lo ",response);

    if (response?.success) {

      setUser(response.data);

    }

    setLoading(false);

  };

  if (token && userId) {

    fetchUser();

  }

}, [token, userId]);


if (loading) {

  return (

    <div className="flex h-screen items-center justify-center text-white">

      Loading...

    </div>

  );

}

if (!user) {

  //console.log("Lo Pratyush",user);

  return (

    <div className="flex h-screen items-center justify-center text-white">

      User not found

    </div>

  );

}

console.log("Instructor Data:", user);

  const basic = user.basicInformation;
  const profile = user.profileInformation;
  const stats = user.statistics;

  return (
    <div className="min-h-screen bg-richblack-900">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6">

        <div className="flex items-center justify-between rounded-lg border border-richblack-700 bg-richblack-900 p-6">
          <div className="flex items-center gap-5">
            <div className="overflow-hidden rounded-xl border border-richblack-700 bg-richblack-950">
              <img
                src={basic.image || `https://api.dicebear.com/5.x/initials/svg?seed=${basic.firstName}+${basic.lastName}`}
                alt={`${basic.firstName} ${basic.lastName}`}
                className="h-28 w-28 object-cover"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-yellow-50/70">User Profile</p>
              <h2 className="mt-2 text-3xl font-bold text-richblack-5">{basic.firstName} {basic.lastName}</h2>
              <p className="mt-2 text-sm text-richblack-300">{basic.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-xl bg-richblack-800 px-4 py-2 text-sm font-semibold text-richblack-50">{basic.accountType}</span>
            <span className={`rounded-xl px-4 py-2 text-sm font-semibold ${basic.active ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>
              {basic.active ? "Active" : "Blocked"}
            </span>
            <button
              onClick={() => navigate(-1)}
              className="rounded-xl bg-richblack-800 px-4 py-2 text-sm font-semibold text-richblack-100 transition hover:bg-richblack-700"
            >
               ← Back
            </button>
          </div>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1,8fr_1fr]">
          <div className="space-y-8">
            <section className="rounded-xl border border-richblack-700 bg-richblack-950/80 p-6">
              <h3 className="mb-5 text-xl font-semibold text-yellow-50">Basic Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-richblack-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">Name</p>
                  <p className="mt-2 text-richblack-5">{basic.firstName} {basic.lastName}</p>
                </div>
                <div className="rounded-lg bg-richblack-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">Email</p>
                  <p className="mt-2 text-richblack-5">{basic.email}</p>
                </div>
                <div className="rounded-lg bg-richblack-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">Joined</p>
                  <p className="mt-2 text-richblack-5">{new Date(basic.joinedOn).toLocaleDateString()}</p>
                </div>
                <div className="rounded-lg bg-richblack-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">Approval</p>
                  <p className="mt-2 text-richblack-5">{basic.approvalStatus}</p>
                </div>
                <div className="rounded-lg bg-richblack-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">Browser</p>
                  <p className="mt-2 text-richblack-5">{basic.browser || "-"}</p>
                </div>
                <div className="rounded-lg bg-richblack-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">IP Address</p>
                  <p className="mt-2 text-richblack-5">{basic.ipAddress || "-"}</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-richblack-700 bg-richblack-950/80 p-6">
              <h3 className="mb-5 text-xl font-semibold text-yellow-50">Profile Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-richblack-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">Phone</p>
                  <p className="mt-2 text-richblack-5">{profile.contactNumber || "-"}</p>
                </div>
                <div className="rounded-lg bg-richblack-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">Gender</p>
                  <p className="mt-2 text-richblack-5">{profile.gender || "-"}</p>
                </div>
                <div className="rounded-lg bg-richblack-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">DOB</p>
                  <p className="mt-2 text-richblack-5">{profile.dateOfBirth || "-"}</p>
                </div>
                <div className="sm:col-span-2 rounded-lg bg-richblack-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-richblack-400">About</p>
                  <p className="mt-2 text-richblack-5">{profile.about || "-"}</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-richblack-700 bg-richblack-950/80 p-5">

  <h3 className="mb-4 text-xl font-semibold text-yellow-50">
    Top Performing Course
  </h3>

  <div className="flex gap-4">

    <img
      src={
        stats?.topCourse?.thumbnail ||
        "https://placehold.co/180x100/161D29/F1F2FF?text=Course"
      }
      alt="Course"
      className="h-28 w-40 rounded-xl object-cover"
    />

    <div className="flex flex-1 flex-col justify-between">

      <div>
        <h2 className="line-clamp-2 text-lg font-bold text-richblack-5">
          {stats?.topCourse?.courseName || "No Course Available"}
        </h2>

        <div className="mt-1 text-yellow-50 text-sm">
          ★★★★★
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">

        <div className="rounded-xl bg-richblack-800 p-2 text-center">
          <p className="text-[10px] uppercase text-richblack-400">
            Students
          </p>

          <h3 className="text-lg font-bold text-blue-300">
            {stats?.topCourse?.students || 0}
          </h3>
        </div>

        <div className="rounded-xl bg-richblack-800 p-2 text-center">
          <p className="text-[10px] uppercase text-richblack-400">
            Revenue
          </p>

          <h3 className="text-lg font-bold text-caribbeangreen-100">
            ₹{stats?.topCourse?.revenue || 0}
          </h3>
        </div>

        <div className="rounded-xl bg-richblack-800 p-2 text-center">
          <p className="text-[10px] uppercase text-richblack-400">
            Complete
          </p>

          <h3 className="text-lg font-bold text-yellow-50">
            {stats?.topCourse?.completionRate || 0}%
          </h3>
        </div>

      </div>

    </div>

  </div>

</section>
          </div>

          

          <aside className="flex flex-col gap-8">
            <section className="rounded-xl border border-richblack-700 bg-richblack-950/80 p-6">
                <h3 className="mb-5 text-xl font-semibold text-yellow-50">
                    Instructor Statistics
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-richblack-700 bg-richblack-900 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-richblack-100">
                          📊 Total Courses
                        </h3>
                      </div>
                        <h2 className="mt-3 text-3xl font-bold text-yellow-50">
                            {stats.totalCourses}
                        </h2>
                    </div>

                    <div
  onClick={() =>
    navigate(`/dashboard/admin/instructor/${userId}/published-courses`)
  }
  className="
    group
    cursor-pointer
    rounded-lg
    border
    border-richblack-700
    bg-richblack-900
    p-4
    transition-all
    duration-300
    hover:border-caribbeangreen-100
    hover:bg-richblack-800
    hover:-translate-y-1
  "
>
  {/* Header */}
  <div className="flex items-center justify-between">

    <h3 className="text-sm font-semibold text-richblack-100">
      📚 Published Courses
    </h3>

    <span className="text-lg text-caribbeangreen-100 transition-transform duration-300 group-hover:translate-x-1">
      →
    </span>

  </div>

  {/* Count */}
  <h2 className="mt-4 text-3xl font-bold text-caribbeangreen-100">
    {stats.publishedCourses}
  </h2>

  {/* Footer */}
  <div className="mt-4 flex items-center justify-between">

    <span className="text-xs text-richblack-400">
      View Details
    </span>

    <span className="text-xs text-caribbeangreen-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      Click
    </span>

  </div>

</div>

                    <div
  onClick={() => setShowPendingModal(true)}
  className="
    group
    cursor-pointer
    rounded-lg
    border
    border-richblack-700
    bg-richblack-900
    p-4
    transition-all
    hover:border-yellow-50
    hover:bg-richblack-800
  "
>

<div className="flex justify-between">

<h3 className="text-sm font-semibold text-richblack-100">
🟡 Pending Courses
</h3>

<span className="text-yellow-50">→</span>

</div>

<h2 className="mt-4 text-3xl font-bold text-yellow-50">
{stats.pendingCourses}
</h2>

<p className="mt-4 text-xs text-richblack-400">
Waiting for Review
</p>

</div>

                    <div
onClick={()=>setShowRejectedModal(true)}
className="
group
cursor-pointer
rounded-lg
border
border-richblack-700
bg-richblack-900
p-4
transition-all
hover:border-pink-200
hover:bg-richblack-800
"
>

<div className="flex justify-between">

<h3 className="text-sm font-semibold text-richblack-100">
🔴 Rejected Courses
</h3>

<span className="text-pink-200">→</span>

</div>

<h2 className="mt-4 text-3xl font-bold text-pink-200">
{stats.rejectedCourses}
</h2>

<p className="mt-4 text-xs text-richblack-400">
Need Changes
</p>

</div>

                     <div
onClick={()=>setShowDraftModal(true)}
className="
group
cursor-pointer
rounded-lg
border
border-richblack-700
bg-richblack-900
p-4
transition-all
hover:border-richblack-200
hover:bg-richblack-800
"
>

<div className="flex justify-between">

<h3 className="text-sm font-semibold text-richblack-100">
⚪ Draft Courses
</h3>

<span className="text-richblack-100">→</span>

</div>

<h2 className="mt-4 text-3xl font-bold text-richblack-5">
{stats.draftCourses}
</h2>

<p className="mt-4 text-xs text-richblack-400">
Not Submitted
</p>

</div>

                    <div
onClick={()=>navigate(`/dashboard/admin/instructor/${userId}/students`)}
className="
group
cursor-pointer
rounded-lg
border
border-richblack-700
bg-richblack-900
p-4
transition-all
hover:border-blue-200
hover:bg-richblack-800
"
>

<div className="flex justify-between">

<h3 className="text-sm font-semibold text-richblack-100">
👨‍🎓 Students
</h3>

<span className="text-blue-200">→</span>

</div>

<h2 className="mt-4 text-3xl font-bold text-blue-200">
{stats.totalStudents}
</h2>

<p className="mt-4 text-xs text-richblack-400">
View Students
</p>

</div>
</div>
</section>


            

  <div className="grid gap-6 lg:grid-cols-2">

    {/* Activity */}
    <section className="rounded-xl border border-richblack-700 bg-richblack-950/80 p-6">
      <h3 className="mb-5 text-xl font-semibold text-yellow-50">
        Activity
      </h3>

      <div className="space-y-4">

        <div className="rounded-lg bg-richblack-900 p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-richblack-400">
            Recent Login
          </p>

          <p className="mt-2 text-richblack-5">
            {basic.lastLogin
              ? new Date(basic.lastLogin).toLocaleString()
              : "-"}
          </p>
        </div>

        <div className="rounded-lg bg-richblack-900 p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-richblack-400">
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

    {/* Revenue */}
    <section className="rounded-xl border border-richblack-700 bg-richblack-950/80 p-6">
      <h3 className="mb-5 text-xl font-semibold text-yellow-50">
        Revenue
      </h3>

      <div className="rounded-lg bg-richblack-900 p-5">

        <p className="text-richblack-400">
          Total Revenue
        </p>

        <h2 className="mt-3 text-5xl font-bold text-caribbeangreen-100">
          ₹ {stats.totalRevenue}
        </h2>

        <p className="mt-4 text-sm text-richblack-400">
          Lifetime Earnings
        </p>

      </div>
    </section>

  </div>
     </aside>

    {/* <div className="rounded-lg bg-richblack-900 p-4">
      <p className="text-richblack-300">
        Average Course Price
      </p>

      <h2 className="mt-2 text-3xl font-bold text-yellow-50">
        ₹{stats.averageCoursePrice}
      </h2>
    </div> */}

  </div>

        <div className="mt-10 grid gap-6">

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-richblack-700 bg-richblack-950/80 p-6">
              <h3 className="mb-5 text-xl font-semibold text-yellow-50">Notifications ({user.notifications?.length || 0})</h3>
              <div className="space-y-3">
                {user.notifications?.map((notification) => (
                  <div key={notification.id} className="rounded-3xl bg-richblack-900 p-4">
                    <p className="font-semibold text-richblack-5">{notification.title}</p>
                    <p className="mt-2 text-sm text-richblack-300">{notification.message}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-richblack-700 bg-richblack-950/80 p-6">
              <h3 className="mb-5 text-xl font-semibold text-yellow-50">Support Tickets ({user.supportTickets?.length || 0})</h3>
              <div className="space-y-3">
                {user.supportTickets?.map((ticket) => (
                  <div key={ticket.id} className="rounded-3xl bg-richblack-900 p-4">
                    <p className="font-semibold text-richblack-5">{ticket.subject}</p>
                    <p className="mt-2 text-sm text-richblack-300">Status: {ticket.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

      </div>

      {showPendingModal && (
  <PendingCoursesModal
    courses={user.pendingCourses}
    onClose={() => setShowPendingModal(false)}
  />
)}

{showRejectedModal && (
  <RejectedCoursesModal
    courses={user.rejectedCourses}
    onClose={() => setShowRejectedModal(false)}
  />
)}

{showDraftModal && (
  <DraftCoursesModal
    courses={user.draftCourses}
    onClose={() => setShowDraftModal(false)}
  />
)}

    </div>
  );
};

export default InstructorProfilePage;