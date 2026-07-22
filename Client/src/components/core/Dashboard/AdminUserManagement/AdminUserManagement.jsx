import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import SearchBar from "./SearchBar";
import SearchFilters from "./SearchFilters";
import UserTable from "./UserTable";
import Pagination from "./Pagination";
import { useSelector } from "react-redux";
import { searchUser, viewUserProfile, toggleUserStatus, sendNotification, deleteUser,} from "../../../../services/operations/adminUserManagementAPI";
import DeleteUserModal from "./DeleteUserModal";
import NotificationModal from "./NotificationModal";
import {
  FaUsers,
  FaUserCheck,
  FaUserSlash,
  FaChalkboardTeacher,
  FaUserGraduate,
} from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";

const AdminUserManagement = () => {

  // ======================================================
  // States
  // ======================================================

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [role, setRole] = useState("all");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  
  const { token } = useSelector((state) => state.auth);
  const totalUsers = users.length;

const instructorCount = users.filter(
  (user) => user.accountType === "Instructor"
).length;

const studentCount = users.filter(
  (user) => user.accountType === "Student"
).length;

const activeUsers = users.filter(
  (user) => user.active
).length;

const blockedUsers = users.filter(
  (user) => !user.active
).length;

const newUsersToday = users.filter((user) => {
  const today = new Date().toDateString();
  return new Date(user.createdAt).toDateString() === today;
}).length;
  

  // ======================================================
  // Search User
  // ======================================================

 const handleSearch = async (showToast = true) => {
  const trimmedQuery = searchQuery.trim();

  if (!token) return;

  if (!trimmedQuery) {
    if (showToast) {
      toast.error("Search query is required");
    }
    setUsers([]);
    setTotalPages(1);
    setLoading(false);
    setInitialLoading(false);
    return;
  }

  setLoading(true);

  const response = await searchUser(
    token,
    trimmedQuery,
    role,
    page,
    10,
    showToast
  );

  if (response?.success) {
    setUsers(response.users);
    setTotalPages(response.totalPages);
  } else {
    setUsers([]);
    setTotalPages(1);
  }

  setLoading(false);
  setInitialLoading(false);
};

const handleViewProfile = async (userId) => {

  setProfileLoading(true);

  const response = await viewUserProfile(
    token,
    userId
  );

  if (response?.success) {

    setSelectedUser(response.data);

    setShowProfileModal(true);

  }

  setProfileLoading(false);

};
const handleToggleStatus = async (userId) => {

  const response = await toggleUserStatus(
    token,
    userId
  );

  if (response?.success) {
    handleSearch();
  }

};
const handleSendNotification = async (
  userId,
  title,
  message
) => {

  const response = await sendNotification(
    token,
    {
      userId,
      title,
      message,
    }
  );

  if (response?.success) {

    setShowNotificationModal(false);

    setSelectedUser(null);

  }

};

const handleDeleteUser = async (userId) => {

  const response = await deleteUser(
    token,
    userId
  );

  if (response?.success) {

    setShowDeleteModal(false);

    setSelectedUser(null);

    handleSearch();

  }

};

  useEffect(() => {
    if (!token) return;
    if (!searchQuery.trim()) return;
    handleSearch(false);
  }, [token, page, role, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [role]);
  return (

    <div className="w-full text-richblack-5">

     <div className="space-y-10">
       {/* ================= HEADER ================= */}

<div className="rounded-xl border border-richblack-700 bg-richblack-900 p-8">

<p className="text-sm uppercase tracking-[0.35em] text-yellow-50/70">
Premium Admin Console
</p>

<h1 className="mt-4 text-5xl font-bold">
User Management
</h1>

<p className="mt-5 text-lg text-richblack-300 max-w-3xl leading-8">
Manage every learner and instructor with clarity,
speed and high-end controls.
</p>

</div>

{/* ================= STATS ================= */}

<div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-6">

  {/* Total Users */}

  <div className="rounded-xl border border-richblack-700 bg-richblack-900 p-5 hover:border-cyan-400 transition-all">

    <div className="flex items-center justify-between">

      <div>

        <p className="text-richblack-400">
          Total Users
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {totalUsers}
        </h2>

      </div>

      <FaUsers className="text-4xl text-cyan-400"/>

    </div>

  </div>

  {/* Active */}

  <div className="rounded-xl border border-richblack-700 bg-richblack-900 p-5 hover:border-green-400 transition-all">

    <div className="flex items-center justify-between">

      <div>

        <p className="text-richblack-400">
          Active
        </p>

        <h2 className="mt-2 text-3xl font-bold text-green-400">
          {activeUsers}
        </h2>

      </div>

      <FaUserCheck className="text-4xl text-green-400"/>

    </div>

  </div>

  {/* Blocked */}

  <div className="rounded-xl border border-richblack-700 bg-richblack-900 p-5 hover:border-red-400 transition-all">

    <div className="flex items-center justify-between">

      <div>

        <p className="text-richblack-400">
          Blocked
        </p>

        <h2 className="mt-2 text-3xl font-bold text-red-400">
          {blockedUsers}
        </h2>

      </div>

      <FaUserSlash className="text-4xl text-red-400"/>

    </div>

  </div>

  {/* Instructor */}

  <div className="rounded-xl border border-richblack-700 bg-richblack-900 p-5 hover:border-yellow-400 transition-all">

    <div className="flex items-center justify-between">

      <div>

        <p className="text-richblack-400">
          Instructors
        </p>

        <h2 className="mt-2 text-3xl font-bold text-yellow-400">
          {instructorCount}
        </h2>

      </div>

      <FaChalkboardTeacher className="text-4xl text-yellow-400"/>

    </div>

  </div>

  {/* Student */}

  <div className="rounded-xl border border-richblack-700 bg-richblack-900 p-5 hover:border-pink-400 transition-all">

    <div className="flex items-center justify-between">

      <div>

        <p className="text-richblack-400">
          Students
        </p>

        <h2 className="mt-2 text-3xl font-bold text-pink-400">
          {studentCount}
        </h2>

      </div>

      <FaUserGraduate className="text-4xl text-pink-400"/>

    </div>

  </div>

  {/* New Users Today */}

<div className="rounded-xl border border-richblack-700 bg-richblack-900 p-5 hover:border-blue-400 transition-all">

  <div className="flex items-center justify-between">

    <div>

      <p className="text-richblack-400">
        New Users Today
      </p>

      <h2 className="mt-2 text-3xl font-bold text-blue-400">
        {newUsersToday}
      </h2>

    </div>

    <FaUserPlus className="text-4xl text-blue-400" />

  </div>

</div>

</div>

        <div className="mt-10 flex gap-6">
          <div className="flex-1 rounded-xl border border-richblack-700 bg-richblack-900 p-5">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
            />
          </div>

          
            <h2 className="mb-3 text-lg font-bold text-yellow-50">
            </h2>
            <div className="w-[320px]">
              <SearchFilters role={role} setRole={setRole} />
            </div>
            
          
        </div>
      </div>

      <div className="mt-8">
        <UserTable
          users={users}
          loading={loading}
          setSelectedUser={setSelectedUser}
          setShowProfileModal={setShowProfileModal}
          handleViewProfile={handleViewProfile}
          handleToggleStatus={handleToggleStatus}
          setShowNotificationModal={setShowNotificationModal}
          setShowDeleteModal={setShowDeleteModal}
        />
      </div>

      <div className="mt-8">
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>
      {showProfileModal && (

  <UserProfileModal

    user={selectedUser}

    onClose={() => {

      setShowProfileModal(false);

      setSelectedUser(null);

    }}

  />

)}

   {showNotificationModal && (

  <NotificationModal
    user={selectedUser}
    onClose={() => {

      setShowNotificationModal(false);

      setSelectedUser(null);

    }}
    onSend={handleSendNotification}
  />

)}

{showDeleteModal && (

  <DeleteUserModal
    user={selectedUser}
    onClose={() => {
      setShowDeleteModal(false);
      setSelectedUser(null);
    }}
    onDelete={handleDeleteUser}
  />

)}

    </div>

  );

};

export default AdminUserManagement;