import { apiConnector } from "../apiconnector";
import { toast } from "react-hot-toast";
import { adminActivityEndpoints } from "../apis";
const {
  GET_RECENT_ACTIVITIES_API,
  DELETE_ACTIVITY_API,
  MARK_ACTIVITY_READ_API,
} = adminActivityEndpoints;

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const getDashboardStats = async (token) => {
  let result = null;

  try {
    const response = await apiConnector(
      "GET",
      `${BASE_URL}/admin/dashboard-stats`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    result = response?.data?.data;
  } catch (error) {
    console.log(error);
    toast.error("Failed to fetch dashboard stats");
  }

  return result;
};

export const getAdminDashboard = async (token) => {
  let result = null;

  try {
    const response = await apiConnector(
      "GET",
      `${BASE_URL}/admin/dashboard`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    result = response?.data?.data;
  } catch (error) {
    console.log(error);
    toast.error("Failed to fetch admin dashboard data");
  }

  return result;
};

export const getPendingInstructors = async (token) => {
  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      `${BASE_URL}/admin/pending-instructors`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    result = response?.data?.data;
  } catch (error) {
    console.log(error);
    toast.error("Failed to fetch pending instructors");
  }

  return result;
};

export const approveInstructor = async (token, instructorId) => {
  try {
    const response = await apiConnector(
      "PATCH",
      `${BASE_URL}/admin/instructors/${instructorId}/approve`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    toast.success("Instructor Approved");
    return response.data;
  } catch (error) {
    console.log(error);
    toast.error("Failed to approve instructor");
  }
};

export const rejectInstructor = async (token, instructorId) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${BASE_URL}/admin/instructors/${instructorId}/reject`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    toast.success("Instructor Rejected");
    return response.data;
  } catch (error) {
    console.log(error);
    toast.error("Failed to reject instructor");
  }
};

export const getApprovedInstructors = async (token) => {
  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      `${BASE_URL}/admin/approved-instructors`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    result = response?.data?.data;
  } catch (error) {
    console.log(error);
    toast.error("Failed to fetch approved instructors");
  }

  return result;
};

export const getRejectedInstructors = async (token) => {
  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      `${BASE_URL}/admin/rejected-instructors`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    result = response?.data?.data;
  } catch (error) {
    console.log(error);
    toast.error("Failed to fetch rejected instructors");
  }

  return result;
};



export const getRecentActivities = async (token) => {
  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      `${BASE_URL}/admin/recent-activities`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    result = response?.data?.data;
  } catch (error) {
    console.log(error);
    toast.error("Failed to fetch recent activities");
  }

  return result;
};


export const deleteActivity = async (token, activityId, type) => {
  let result = false;

  try {

    const response = await apiConnector(
      "DELETE",
      `${BASE_URL}/admin/activity/${activityId}?type=${type}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    result = response?.data?.success;

    toast.success("Activity Deleted");

  } catch (error) {

    console.log(error);

    toast.error("Failed to delete activity");

  }

  return result;
};



export async function markActivityAsRead(token, activityId) {
  try {
    const response = await apiConnector(
      "PATCH",
          `${MARK_ACTIVITY_READ_API}/${activityId}/read`,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    return response.data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
