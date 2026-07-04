import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import SearchBar from "./SearchBar";
import SearchFilters from "./SearchFilters";
import UserTable from "./UserTable";
import Pagination from "./Pagination";
import { useSelector } from "react-redux";
import { searchUser, viewUserProfile, toggleUserStatus, sendNotification, deleteUser } from "../../../../services/operations/adminUserManagementAPI";
import UserProfileModal from "./UserProfileModal";
import NotificationModal from "./NotificationModal";
import DeleteUserModal from "./DeleteUserModal";

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
  const activeUsers = users.filter((user) => user.active).length;
  const blockedUsers = users.filter((user) => !user.active).length;
  const instructorCount = users.filter((user) => user.accountType === "Instructor").length;
  const studentCount = users.filter((user) => user.accountType === "Student").length;

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

      <div className="rounded-xl border border-richblack-700 bg-gradient-to-br from-richblack-900 via-richblack-800 to-[#1b1c2b] p-8 shadow-[0_35px_80px_rgba(14,21,54,0.35)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-yellow-50/70">
              Premium Admin Console
            </p>
            <h1 className="text-4xl font-semibold text-richblack-5">
              User Management
            </h1>
            <p className="mt-3 max-w-2xl text-richblack-300">
              Manage every learner and instructor with clarity, speed, and high-end controls.
            </p>
          </div>

          <div className="grid w-full max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-richblack-900/80 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              <p className="text-sm text-richblack-400">Total users</p>
              <p className="mt-2 text-3xl font-semibold text-yellow-50">{totalUsers}</p>
            </div>
            <div className="rounded-xl bg-richblack-900/80 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              <p className="text-sm text-richblack-400">Active</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-300">{activeUsers}</p>
            </div>
            <div className="rounded-xl bg-richblack-900/80 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              <p className="text-sm text-richblack-400">Blocked</p>
              <p className="mt-2 text-3xl font-semibold text-red-400">{blockedUsers}</p>
            </div>
            <div className="rounded-xl bg-richblack-900/80 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              <p className="text-sm text-richblack-400">Instructors</p>
              <p className="mt-2 text-3xl font-semibold text-sky-300">{instructorCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 items-start lg:grid-cols-[2fr_1fr]">
          <div className="self-start rounded-xl border border-richblack-700 bg-richblack-950/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
            />
          </div>

          <div className="self-start rounded-xl border border-richblack-700 bg-richblack-950/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            <h2 className="mb-4 text-sm uppercase tracking-[0.25em] text-yellow-50/70">
              Filters
            </h2>
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