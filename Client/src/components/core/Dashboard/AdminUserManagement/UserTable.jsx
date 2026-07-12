import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaEllipsisH, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const UserTable = ({ users, loading, setSelectedUser, setShowProfileModal, handleViewProfile, handleToggleStatus, setShowNotificationModal, setShowDeleteModal, }) => {

  const [openMenu, setOpenMenu] = useState(null);
   const [menuPosition, setMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const openDropdown = (e, userId) => {
  e.stopPropagation();

  const rect = e.currentTarget.getBoundingClientRect();

setMenuPosition({
  x: rect.right - 225,
  y: rect.top - 140,
});

  setOpenMenu(openMenu === userId ? null : userId);
};

 useEffect(() => {
    const close = () => setOpenMenu(null);

    window.addEventListener("click", close);

    return () => window.removeEventListener("click", close);
  }, []);

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
  <div
    className="
      overflow-visible
      rounded-2xl
      border
      border-richblack-700
      bg-gradient-to-b
      from-richblack-900
      to-richblack-950
      shadow-[0_20px_80px_rgba(0,0,0,.35)]
    "
  >

    <div className="overflow-x-auto overflow-y-visible">

      <table className=" w-full min-w-[760px] border-separate border-spacing-0 text-sm">

        <thead className="bg-richblack-800/70 backdrop-blur-xl">
          <tr>
            <th className="p-4 text-left text-xs uppercase tracking-[0.35em] text-richblack-400">Name</th>
            <th className="p-4 text-left text-xs uppercase tracking-[0.35em] text-richblack-400">Email</th>
            <th className="p-4 text-left text-xs uppercase tracking-[0.35em] text-richblack-400">Role</th>
            <th className="p-4 text-left text-xs uppercase tracking-[0.35em] text-richblack-400">Status</th>
            <th className="p-4 text-left text-xs uppercase tracking-[0.35em] text-richblack-400">Last Login</th>
            <th className="p-4 text-left text-xs uppercase tracking-[0.35em] text-richblack-400">Last Logout</th>
            <th className="p-4 text-center text-xs uppercase tracking-[0.35em] text-richblack-400">Actions</th>
          </tr>
        </thead>

        <tbody>

          {users.map((user) => (
            <tr
              key={user._id}
              className="border-t border-richblack-800 transition-all duration-300 hover:bg-richblack-800/50 "
            >
            <td className="relative overflow-visible p-4">
              <div className="space-y-2">
                <div className="text-[18px] font-semibold text-richblack-5">
                  {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-richblack-400">
                    ID: {user._id}
                    </div>
              </div>
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
               <td className="relative p-4">

  <div className="flex justify-center">

  <button
  onClick={(e) => openDropdown(e, user._id)}
  className="flex h-10 w-10 items-center justify-center rounded-lg bg-richblack-800 transition hover:bg-richblack-700"
>
  <FaEllipsisH />
</button>

  </div>

 {openMenu &&
createPortal(

<div
ref={menuRef}
style={{
left: menuPosition.x,
top: menuPosition.y,
position:"fixed"
}}
className="
z-[999999]
w-56
overflow-hidden
rounded-2xl
border
border-richblack-700
bg-richblack-800
backdrop-blur-xl
shadow-[0_25px_70px_rgba(0,0,0,.65)]
"
onClick={(e)=>e.stopPropagation()}
>

    <div className="flex justify-end p-2">
    <button
      onClick={() => setOpenMenu(null)}
      className="rounded-md p-2 text-richblack-300 transition hover:bg-richblack-700 hover:text-richblack-5"
    >
      <FaTimes size={14} />
    </button>
  </div>


     <button
  onClick={() => {

    const selectedUser = users.find(
      (u) => u._id === openMenu
    );

    if (!selectedUser) return;

    if (selectedUser.accountType === "Instructor") {
      navigate(`/dashboard/user-management/instructor/${selectedUser._id}`);
    } else {
      navigate(`/dashboard/user-management/student/${selectedUser._id}`);
    }

    setOpenMenu(null);

  }}
  className="
  block
  w-full
  px-5
  py-3
  text-left
  text-richblack-25
  transition-all
  hover:bg-richblack-700
  hover:pl-7
  "
>
  View Profile
</button>

<button
onClick={()=>{
const user=users.find(u=>u._id===openMenu);

setSelectedUser(user);

setShowNotificationModal(true);

setOpenMenu(null);
}}
className="
block
w-full
px-5
py-3
text-left
text-richblack-25
transition-all
hover:bg-richblack-700
hover:pl-7
"
>
Send Notification
</button>

<button
onClick={()=>{
handleToggleStatus(openMenu);

setOpenMenu(null);
}}
className="
block
w-full
px-5
py-3
text-left
text-richblack-25
transition-all
hover:bg-richblack-700
hover:pl-7
"
>
Toggle Status
</button>

<button
onClick={()=>{

const user=users.find(u=>u._id===openMenu);

setSelectedUser(user);

setShowDeleteModal(true);

setOpenMenu(null);

}}
className="
block
w-full
px-5
py-3
text-left
hover:bg-richblack-700
hover:pl-7
text-pink-400
hover:bg-red-500/10
"
>
Delete User
</button>

</div>,

document.body

)}

</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
    </div>
  );
};

export default UserTable;