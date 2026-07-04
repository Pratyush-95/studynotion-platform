import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";


const UserTable = ({ users, loading, setSelectedUser, setShowProfileModal, handleViewProfile, handleToggleStatus, setShowNotificationModal, setShowDeleteModal, }) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-richblack-700 bg-richblack-950/90 p-10 text-center text-richblack-200 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        Loading...
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="rounded-xl border border-richblack-700 bg-richblack-950/90 p-10 text-center text-richblack-400 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        No users found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-richblack-700 bg-richblack-950/90 p-4 shadow-[0_30px_70px_rgba(0,0,0,0.18)]">

      <table className="w-full min-w-[760px] overflow-hidden rounded-lg bg-richblack-900 text-sm">

        <thead className="bg-richblack-800">
          <tr>
            <th className="p-4 text-left text-xs uppercase tracking-[0.2em] text-richblack-400">Name</th>
            <th className="p-4 text-left text-xs uppercase tracking-[0.2em] text-richblack-400">Email</th>
            <th className="p-4 text-left text-xs uppercase tracking-[0.2em] text-richblack-400">Role</th>
            <th className="p-4 text-left text-xs uppercase tracking-[0.2em] text-richblack-400">Status</th>
            <th className="p-4 text-left text-xs uppercase tracking-[0.2em] text-richblack-400">Last Login</th>
            <th className="p-4 text-left text-xs uppercase tracking-[0.2em] text-richblack-400">Last Logout</th>
            <th className="p-4 text-center text-xs uppercase tracking-[0.2em] text-richblack-400">Actions</th>
          </tr>
        </thead>

        <tbody>

          {users.map((user) => (
            <tr
              key={user._id}
              className="border-t border-richblack-800 transition-colors duration-200 hover:bg-richblack-900"
            >
              <td className="p-4">
                <div className="font-medium text-richblack-5">{user.firstName} {user.lastName}</div>
                <div className="mt-1 text-xs text-richblack-300">ID: {user._id}</div>
              </td>
              <td className="p-4 text-richblack-300">{user.email}</td>
              <td className="p-4">
                <span className="inline-flex rounded-full bg-richblack-800 px-3 py-1 text-xs font-semibold text-sky-200">{user.accountType}</span>
              </td>
              <td className="p-4">
                {user.active ? (
                  <span className="inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">Active</span>
                ) : (
                  <span className="inline-flex rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-300">Blocked</span>
                )}
              </td>
              <td className="p-4 text-richblack-300">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "-"}</td>
              <td className="p-4 text-richblack-300">{user.lastLogout ? new Date(user.lastLogout).toLocaleString() : "-"}</td>
              <td className="p-4">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    title="View Profile"
                    className="rounded-full bg-richblack-800 p-2 text-blue-400 transition hover:bg-richblack-700 hover:text-blue-300"
                    onClick={() => handleViewProfile(user._id)}
                  >
                    <FaEye size={18} />
                  </button>
                  <button
                    title="Activate / Deactivate"
                    className="rounded-full bg-richblack-800 p-2 text-yellow-400 transition hover:bg-richblack-700 hover:text-yellow-300"
                    onClick={() => handleToggleStatus(user._id)}
                  >
                    {user.active ? <BsToggleOn size={24} /> : <BsToggleOff size={24} />}
                  </button>
                  <button
                    title="Send Notification"
                    className="rounded-full bg-richblack-800 p-2 text-green-400 transition hover:bg-richblack-700 hover:text-green-300"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowNotificationModal(true);
                    }}
                  >
                    <IoNotifications size={18} />
                  </button>
                  <button
                    title="Delete User"
                    className="rounded-full bg-richblack-800 p-2 text-red-500 transition hover:bg-richblack-700 hover:text-red-400"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteModal(true);
                    }}
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default UserTable;