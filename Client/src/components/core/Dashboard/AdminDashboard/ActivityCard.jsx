import {
  FiBell,
  FiBook,
  FiDollarSign,
  FiMessageSquare,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiGlobe,
  FiMonitor,
  FiClock,
  FiMoreVertical,
  FiShield,
  FiX,
} from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import {FiTrash2, FiBookOpen,FiClipboard,FiCheck } from "react-icons/fi";
import { useSelector } from "react-redux";
import { deleteActivity } from "../../../../services/operations/adminAPI";
import { toast } from "react-hot-toast";
import { markActivityAsRead } from "../../../../services/operations/adminAPI";

// ----------------------
// Helper Functions
// ----------------------

const formatTitle = (value) => {
  if (!value) return "Activity";

  return value
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
};

const formatDate = (value) => {
  const date = new Date(value);

  if (isNaN(date.getTime()))
    return "Recently";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getActivityIcon = (activity) => {
  const type = activity?.type?.toUpperCase();
  const subType = activity?.subType?.toUpperCase();

  if (type === "PAYMENT")
    return (
      <FiDollarSign className="text-2xl text-green-400" />
    );

  if (type === "COURSE")
    return (
      <FiBook className="text-2xl text-violet-400" />
    );

  if (type === "SUPPORT")
    return (
      <FiMessageSquare className="text-2xl text-yellow-400" />
    );

  if (type === "NOTIFICATION") {
    switch (subType) {
      case "ACCOUNT_ACTIVATED":
        return (
          <FiCheckCircle className="text-2xl text-green-400" />
        );

      case "ACCOUNT_DEACTIVATED":
        return (
          <FiXCircle className="text-2xl text-red-400" />
        );

      case "PROFILE_UPDATED":
        return (
          <FiUser className="text-2xl text-blue-400" />
        );

      default:
        return (
          <FiBell className="text-2xl text-yellow-400" />
        );
    }
  }

  return (
    <FiBell className="text-2xl text-yellow-400" />
  );
};

const getBadgeColor = (type) => {
  switch (type?.toUpperCase()) {

    case "PAYMENT":
      return "border border-caribbeangreen-100 bg-caribbeangreen-100/15 text-caribbeangreen-100";

    case "COURSE":
      return "border border-blue-100 bg-blue-100/15 text-blue-100";

    case "SUPPORT":
      return "border border-yellow-50 bg-yellow-50/15 text-yellow-50";

    case "NOTIFICATION":
      return "border border-richblue-100 bg-richblue-100/15 text-richblue-100";

    default:
      return "border border-richblack-600 bg-richblack-700 text-richblack-25";
  }
};

// ----------------------------------

const ActivityCard = ({ activity, token, onStatusChange }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);

  const handleMarkAsRead = async () => {
  try {
    const updatedActivity = await markActivityAsRead(
      token,
      activity._id
    );

     console.log("API Response:", updatedActivity);

    if (updatedActivity) {
      onStatusChange(activity._id);
       console.log("Status Changed");

      setShowMenu(false);

      toast.success("Marked as Read");
    }
  } catch (err) {
    toast.error("Failed to update");
  }
};
 
  const menuRef = useRef(null);

    const canDelete =
    activity?.type === "NOTIFICATION" ||
    activity?.type === "SUPPORT";
 
   useEffect(() => {

    function handleClickOutside(e) {

      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, []);

  const handleDeleteActivity = async () => {

  const success = await deleteActivity(
    token,
    activity._id,
    activity.type
  );

  if (success) {

    setShowDeleteModal(false);

    toast.success("Activity Deleted");

    window.location.reload();

  }

};

  return (

    <>

    <div className={`group relative isolate rounded-2xl
    border border-richblack-700/40
    bg-gradient-to-br from-richblack-900 via-[#171D2B] to-[#111827]
    px-5 py-4 backdrop-blur-sm transition-all duration-300
    hover:-translate-y-2 hover:scale-[1.01]
    hover:border-yellow-400
    hover:shadow-[0_25px_60px_rgba(250,204,21,0.15)]
  ${showMenu ? "z-[9999]" : "z-10"}`}>

      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-yellow-400 via-blue-400 to-violet-500 opacity-80"></div>
      <div className="flex items-start justify-between gap-5">

        {/* LEFT */}

        <div className="flex gap-4">

          <div className="relative">

  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/30 via-blue-500/20 to-violet-500/30 blur-xl opacity-0 transition duration-300 group-hover:opacity-100"></div>

  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-richblack-600 bg-gradient-to-br from-richblack-700 via-richblack-800 to-richblack-900 shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:border-yellow-400">

    {getActivityIcon(activity)}

  </div>

</div>

          <div>

            <div className="flex items-center gap-2 flex-wrap">

              <h2 className="text-xl font-bold  text-richblack-5">

                {formatTitle(activity?.title)}

              </h2>

              <span
                className={`rounded-xl  border px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider ${getBadgeColor(
                  activity?.type
                )}`}
              >
                {activity?.type || "Notification"}
              </span>

            </div>

            <p className="mt-1 text-sm text-richblack-300 line-clamp-2 leading-6">

              {activity?.message ||
                "No description available."}

            </p>

            {/* -------- Metadata Row -------- */}

            <div className="mt-3 grid grid-cols-4 gap-x-5 gap-y-2 text-xs text-richblack-400">

              <div className="flex items-center gap-2">

                <FiUser />

                {activity?.performedBy?.firstName || "Unknown User"}

              </div>

              <div className="flex items-center gap-2">

                <FiShield />

                {activity?.performedBy?.accountType ||
                  "Student"}

              </div>

              <div className="flex items-center gap-2">

                <FiMonitor />

                {activity?.browser || "Unknown Browser"}

              </div>

              <div className="flex items-center gap-2">

                <FiGlobe />

                {activity?.ipAddress || "::1"}

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}

                <div className="flex flex-col items-end gap-2">

          {/* Time */}

          <div className="flex items-center gap-2 text-xs text-richblack-400">

            <FiClock />

            {formatDate(activity?.createdAt)}

          </div>

          {/* Status */}

          <span
          className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${
            activity?.status === "SUCCESS" ||
            activity?.status === "ACTIVE"
            ? "border-caribbeangreen-100 bg-caribbeangreen-100/15 text-caribbeangreen-100"

            : activity?.status === "FAILED" ||
            activity?.status === "REJECTED"

            ? "border-pink-200 bg-pink-200/15 text-pink-200"

            : activity?.status === "UNREAD"

          ? "border-yellow-50 bg-yellow-50/15 text-yellow-50"

            : "border-blue-100 bg-blue-100/15 text-blue-100"
         }`}
        >
          {activity?.status || "Completed"}
          </span>

          {/* Three Dot Button */}

           <div className="relative" ref={menuRef}>

  <button
    onClick={() => setShowMenu(!showMenu)}
    className="rounded-lg border border-richblack-700 p-2 text-richblack-300 transition-all duration-300 hover:border-yellow-50 hover:bg-richblack-700 hover:text-yellow-50"
  >
    <FiMoreVertical size={18} />
  </button>

  {showMenu && (

    <div className="absolute right-0 top-12 z-[99999] w-56 overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800 shadow-2xl shadow-black/60">


  {/* Payment */}

  {activity?.type === "PAYMENT" && (
  <button
    onClick={() => {
      setShowMenu(false);
      setShowInvoiceModal(true);
    }}
    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-caribbeangreen-100 transition hover:bg-richblack-700"
  >
    <FiClipboard size={18} />
    <span>View Invoice</span>
  </button>
)}

  {/* Course */}

  {activity?.type === "COURSE" && (
  <button
    onClick={() => {
      setShowMenu(false);
      setShowCourseModal(true);
    }}
    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-blue-100 transition hover:bg-richblack-700"
  >
    <FiBookOpen size={18} />
    <span>Open Course</span>
  </button>
)}

  {/* Notification */}

  {activity?.type === "NOTIFICATION" &&
    activity?.status === "UNREAD" && (
     <button
  onClick={handleMarkAsRead}
  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-yellow-50 transition hover:bg-richblack-700"
>
  <FiCheck size={18} />
  <span>Mark as Read</span>
</button>
    )}

  {/* Divider */}

  {canDelete && (
    <div className="h-px bg-richblack-700"></div>
  )}

  {/* Delete */}

  {canDelete && (
    <button
      onClick={() => {
        setShowMenu(false);
        setShowDeleteModal(true);
      }}
      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-pink-200 transition hover:bg-pink-500/10"
    >
      <FiTrash2 size={18} />
      <span>Delete Activity</span>
    </button>
  )}

</div>

  )}

</div>

        </div>

      </div>

      {/* Bottom Divider */}

      <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-richblack-600 to-transparent"></div>

      {/* Footer */}

      <div className="flex items-center justify-between text-xs">

        <div className="flex flex-wrap gap-3">

          <span className="rounded-xl border border-richblack-700 bg-richblack-800 px-3 py-1 text-richblack-200">
            ID : {activity?._id?.slice(-6) || "------"}
          </span>

          {activity?.performedBy?.email && (
            <span className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-blue-300">
              {activity.performedBy.email}
            </span>
          )}

        </div>

        <div className="font-medium text-richblack-300">

          Last Updated :
          {" "}
          {formatDate(activity?.updatedAt || activity?.createdAt)}

        </div>

      </div>

      



  </div>

  {showDeleteModal && (

  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-md">

    <div className="w-[350px] rounded-2xl border border-richblack-700 bg-gradient-to-b from-richblack-800 to-richblack-900 p-6 shadow-2xl">

      <div className="mb-4 flex justify-center">

<div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/15 ring-4 ring-pink-500/10">

<span className="text-3xl">⚠️</span>

</div>

</div>

      <h2 className="text-center text-2xl font-bold text-richblack-5">
        Delete this Activity
      </h2>

      <p className="mt-3 text-center text-sm leading-6 text-richblack-300">
        Are you want to sure delete this activity?
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">

        <button
          onClick={() => setShowDeleteModal(false)}
          className="h-11 rounded-xl border border-richblack-600 bg-richblack-700 font-semibold text-richblack-25 transition hover:bg-richblack-600"
        >
          Cancel
        </button>

       <button
       onClick={handleDeleteActivity}
       className="h-12 rounded-xl bg-gradient-to-r from-pink-600 to-red-600 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:from-pink-500 hover:to-red-500"
       >
        Delete
        </button>

      </div>

    </div>

  </div>

  )}

  {showInvoiceModal && (
   

<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md">

<div className="relative w-[500px] rounded-xl border border-richblack-700 bg-richblack-800 px-6 py-4">

<button
onClick={() => setShowInvoiceModal(false)}
className="absolute right-5 top-5 text-richblack-300 hover:text-white"
>
<FiX size={28}/>
</button>

<div className="mb-2 border-b border-richblack-700 pb-3">

<h2 className="text-3xl font-bold text-richblack-5">
💳 Payment Invoice
</h2>

<p className="mt-2 text-richblack-400">
 Transaction summary for this payment.
</p>

</div>

<div className="space-y-4">

  {/* Student */}

  <div>

    <p className="text-lg font-semibold text-richblack-300">
      👤 Student
    </p>

    <h3 className="mt-1 text-xl font-bold text-richblack-5">
      {activity?.performedBy?.firstName}{" "}
      {activity?.performedBy?.lastName}
    </h3>

  </div>

  <div className="border-b border-richblack-700"></div>

  {/* Amount */}

  <div>

    <p className="text-lg font-semibold text-richblack-300">
      💰 Amount
    </p>

    <h3 className="mt-2 text-xl font-bold text-caribbeangreen-100">
      ₹{activity?.amount}
    </h3>

  </div>

  <div className="border-b border-richblack-700"></div>

  {/* Status */}

  <div>

    <p className="text-lg font-semibold text-richblack-300">
      🟢 Status
    </p>

    <span className="mt-2 inline-block rounded-full bg-caribbeangreen-700 px-4 py-2 text-caribbeangreen-25 font-semibold">
      {activity?.status}
    </span>

  </div>

  <div className="border-b border-richblack-700"></div>

  {/* Order */}

  <div>

    <p className="text-lg font-semibold text-richblack-300">
      🆔 Order ID
    </p>

    <div className="mt-3 rounded-lg bg-richblack-900 border border-richblack-700 p-4">

      <p className="font-mono text-yellow-50 break-all">
        {activity?.orderId}
      </p>

    </div>

  </div>

</div>

</div>

</div>

)}

{showCourseModal && (
  

<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md">

<div className="relative w-[500px] rounded-xl border border-richblack-700 bg-richblack-800 px-6 py-4">

<button
onClick={() => setShowCourseModal(false)}
className="absolute right-5 top-5 text-richblack-300 hover:text-white"
>
<FiX size={28}/>
</button>

<div className="mb-2 border-b border-richblack-700 pb-3">

  <h2 className="text-3xl font-bold text-richblack-5">
    📚 Course Details
  </h2>

  <p className="mt-2 text-richblack-400">
    Course summary and publish information.
  </p>

</div>

<div className="space-y-4">

<div>

<p className="text-xl text-richblack-400">
Course Name
</p>

<h3 className="text-xl font-semibold text-richblack-5">
{activity?.courseName}
</h3>

</div>

<div>

<p className="text-xl text-richblack-400">
Price
</p>

<h3 className="text-xl font-semibold text-yellow-50">
₹{activity?.price}
</h3>

</div>

<div>

<p className="text-xl text-richblack-400">
Instructor
</p>

<h3 className="text-xl font-semibold text-richblack-5">
{activity?.instructor}
</h3>

</div>

<div>

<p className="text-xl text-richblack-400">
Students
</p>

<h3 className="text-xl font-semibold text-blue-100">
{activity?.students}
</h3>

</div>
<div>

<p className="text-xl text-richblack-400">
Category
</p>

<h3 className="text-xl font-semibold text-pink-100">
{activity?.category}
</h3>

</div>


</div>

</div>

</div>

)}

  </>

  );

};

export default ActivityCard;