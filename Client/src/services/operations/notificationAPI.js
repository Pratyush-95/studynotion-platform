import { toast } from "react-hot-toast";

import { apiConnector } from "../apiconnector";
import { notificationEndpoints } from "../apis";

const {
  GET_NOTIFICATIONS_API,
  MARK_NOTIFICATION_READ_API,
  MARK_ALL_NOTIFICATIONS_READ_API,
  GET_UNREAD_NOTIFICATION_COUNT_API,
  DELETE_NOTIFICATION_API,
  DELETE_ALL_NOTIFICATIONS_API,
} = notificationEndpoints;

export const getNotifications = async (token) => {
  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      GET_NOTIFICATIONS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }

    result = response.data.data;
  } catch (error) {
    console.log("GET_NOTIFICATIONS_API ERROR:", error);
    toast.error("Failed to load notifications");
  }

  return result;
};

export const markNotificationRead = async (
  notificationId,
  token
) => {
  try {
    const response = await apiConnector(
      "PUT",
      MARK_NOTIFICATION_READ_API,
      {
        notificationId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.log(error);
    toast.error("Unable to update notification");
  }
};


export const markAllNotificationsRead = async (token) => {
  try {
    const response = await apiConnector(
      "PUT",
      MARK_ALL_NOTIFICATIONS_READ_API,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("All notifications marked as read");
  } catch (error) {
    console.log(error);
    toast.error("Operation failed");
  }
};


export const getUnreadNotificationCount = async (token) => {
  let count = 0;

  try {
    const response = await apiConnector(
      "GET",
      GET_UNREAD_NOTIFICATION_COUNT_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    count = response.data.unreadCount;
  } catch (error) {
    console.log(error);
  }

  return count;
};



export const deleteNotification = async (
  notificationId,
  token
) => {
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_NOTIFICATION_API(notificationId),
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Notification deleted");
  } catch (error) {
    console.log(error);
    toast.error("Delete failed");
  }
};


export const deleteAllNotifications = async (token) => {
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_ALL_NOTIFICATIONS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("All notifications deleted");
  } catch (error) {
    console.log(error);
    toast.error("Delete failed");
  }
};