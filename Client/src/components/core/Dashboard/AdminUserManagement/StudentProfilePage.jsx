import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const StudentProfilePage= () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

  const basic = user.basicInformation;
  const profile = user.profileInformation;
  const stats = user.statistics;

  return (
    <div className="w-full p-8 ">
      <div className="mx-auto w-full max-w-7xl">

        <div className="flex flex-col gap-6 rounded-xl border border-richblack-700 bg-[#0d0f18] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.16)] sm:flex-row sm:items-center sm:justify-between">
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
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
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
          </div>

          <aside className="space-y-8">
          <section className="rounded-[28px] border border-richblack-700 bg-richblack-950/80 p-6">
            <h3 className="mb-5 text-xl font-semibold text-yellow-50">Statistics</h3>
            <div className="grid gap-4">
              <div className="rounded-3xl bg-richblack-900 p-5">
                <p className="text-sm text-richblack-400">Enrolled Courses</p>
                <p className="mt-3 text-4xl font-bold text-yellow-50">{stats.enrolledCourses}</p>
              </div>
              <div className="rounded-3xl bg-richblack-900 p-5">
                <p className="text-sm text-richblack-400">Total Orders</p>
                <p className="mt-3 text-4xl font-bold text-yellow-50">{stats.totalOrders}</p>
              </div>
              <div className="rounded-3xl bg-richblack-900 p-5">
                <p className="text-sm text-richblack-400">Total Spent</p>
                <p className="mt-3 text-4xl font-bold text-yellow-50">₹{stats.totalSpent}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-richblack-700 bg-richblack-950/80 p-6">
            <h3 className="mb-5 text-xl font-semibold text-yellow-50">Activity</h3>
            <div className="space-y-4">
              <div className="rounded-3xl bg-richblack-900 p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-richblack-400">Recent login</p>
                <p className="mt-2 text-richblack-5">{basic.lastLogin ? new Date(basic.lastLogin).toLocaleString() : "-"}</p>
              </div>
              <div className="rounded-3xl bg-richblack-900 p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-richblack-400">Recent logout</p>
                <p className="mt-2 text-richblack-5">{basic.lastLogout ? new Date(basic.lastLogout).toLocaleString() : "-"}</p>
              </div>
            </div>
          </section>
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
          <section className="rounded-[28px] border border-richblack-700 bg-richblack-950/80 p-6">
            <h3 className="mb-5 text-xl font-semibold text-yellow-50">Courses ({user.courses?.length || 0})</h3>
            <div className="grid gap-3">
              {user.courses?.map((course) => (
                <div key={course.id} className="rounded-3xl border border-richblack-700 bg-richblack-900 p-4">
                  <p className="font-semibold text-richblack-5">{course.courseName}</p>
                </div>
              ))}
            </div>
          </section>

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

    </div>
  );
};

export default StudentProfilePage;