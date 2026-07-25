import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaBell } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";

import {
  getNotifications,
  markAllNotificationsRead,
  deleteAllNotifications,
} from "../../../../services/operations/notificationAPI";

import NotificationCard from "./NotificationCard";

export default function Notifications() {
  const { token } = useSelector((state) => state.auth);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);

    const result = await getNotifications(token);

    if (result) {
      setNotifications(result);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(token);
    fetchNotifications();
  };

  const handleDeleteAll = async () => {
    await deleteAllNotifications(token);
    fetchNotifications();
  };

  if (loading) {
    return (
      <div className="text-white text-xl">
        Loading Notifications...
      </div>
    );
  }

  return (
    <div className="mx-auto w-11/12 max-w-5xl py-10">

      <div className="mb-8 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <FaBell className="text-2xl text-yellow-50"/>

          <h1 className="text-3xl font-semibold text-richblack-5">
            Notifications
          </h1>

        </div>

        <div className="flex gap-3">

          <button
            onClick={handleMarkAllRead}
            className="rounded-md bg-yellow-50 px-4 py-2 text-richblack-900"
          >
            Mark All Read
          </button>

          <button
            onClick={handleDeleteAll}
            className="flex items-center gap-2 rounded-md bg-pink-700 px-4 py-2 text-white"
          >
            <FiTrash2 />
            Delete All
          </button>

        </div>

      </div>

      {
        notifications.length === 0 ? (

          <div className="mt-20 text-center text-richblack-300">

            No Notifications Found

          </div>

        ) : (

          <div className="space-y-4">

            {
              notifications.map((notification) => (

                <NotificationCard
                  key={notification._id}
                  notification={notification}
                  refreshNotifications={fetchNotifications}
                />

              ))
            }

          </div>

        )
      }

    </div>
  );
}