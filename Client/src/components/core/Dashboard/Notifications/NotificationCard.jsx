import { FiTrash2 } from "react-icons/fi";
import { FaBell } from "react-icons/fa";
import { useSelector } from "react-redux";

import {
  markNotificationRead,
  deleteNotification,
} from "../../../../services/operations/notificationAPI";

export default function NotificationCard({
  notification,
  refreshNotifications,
}) {
  const { token } = useSelector((state) => state.auth);

  const handleMarkRead = async () => {
    if (notification.isRead) return;

    await markNotificationRead(notification._id, token);
    refreshNotifications();
  };

  const handleDelete = async () => {
    await deleteNotification(notification._id, token);
    refreshNotifications();
  };

  return (
    <div
      className={`rounded-lg border p-5 transition-all duration-300 ${
        notification.isRead
          ? "border-richblack-700 bg-richblack-800"
          : "border-yellow-500 bg-richblack-700"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="mt-1">
            <FaBell
              className={`text-xl ${
                notification.isRead
                  ? "text-richblack-300"
                  : "text-yellow-50"
              }`}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-richblack-5">
              {notification.title}
            </h2>

            <p className="mt-2 text-richblack-200">
              {notification.message}
            </p>

            <p className="mt-3 text-xs text-richblack-400">
              {new Date(notification.createdAt).toLocaleString()}
            </p>

            <span
              className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                notification.isRead
                  ? "bg-richblack-700 text-richblack-200"
                  : "bg-yellow-100 text-yellow-900"
              }`}
            >
              {notification.isRead ? "Read" : "Unread"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {!notification.isRead && (
            <button
              onClick={handleMarkRead}
              className="rounded-md bg-yellow-50 px-3 py-2 text-sm font-medium text-richblack-900 hover:scale-105 transition-all"
            >
              Mark Read
            </button>
          )}

          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 rounded-md bg-pink-700 px-3 py-2 text-sm text-white hover:bg-pink-800 transition-all"
          >
            <FiTrash2 />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}