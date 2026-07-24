import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { adminUserManagementEndpoints } from "../apis";

const {
  SEARCH_USER_API,
  VIEW_USER_PROFILE_API,
  TOGGLE_USER_STATUS_API,
  SEND_NOTIFICATION_API,
  DELETE_USER_API,
  GET_PUBLISHED_COURSES_API,
  GET_INSTRUCTOR_STUDENTS_API,
  GET_DASHBOARD_STATS_API,
} = adminUserManagementEndpoints;

// ======================================================
// Search User
// ======================================================

export const searchUser = async (
  token,
  query,
  role = "all",
  page = 1,
  limit = 10,
  showToast = true
) => {
  const toastId = showToast ? toast.loading("Searching users...") : null;

  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      `${SEARCH_USER_API}?query=${query}&role=${role}&page=${page}&limit=${limit}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    result = response.data;
  }
  catch (error) {
  console.log(error);

  if (
    showToast &&
    error?.response?.status !== 401
  ) {
    toast.error(
      error?.response?.data?.message || "Unable to search users."
    );
  }
}

  if (toastId) {
    toast.dismiss(toastId);
  }

  return result;
};

// ======================================================
// View User Profile
// ======================================================

export const viewUserProfile = async (token, userId) => {
  let result = null;

  try {
    const response = await apiConnector(
      "GET",
      `${VIEW_USER_PROFILE_API}/${userId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    result = response.data;
    console.log("API Response:", response.data);
  } catch (error) {
  console.log(error);

  if (error?.response?.status !== 401) {
    toast.error(
      error?.response?.data?.message ||
      "Unable to fetch user profile."
    );
  }
}

  return result;
};

// ======================================================
// Toggle User Status
// ======================================================

export const toggleUserStatus = async (
  token,
  userId
) => {

  const toastId = toast.loading(
    "Updating status..."
  );

  let result = null;

  try {

    const response = await apiConnector(

      "PATCH",

      `${TOGGLE_USER_STATUS_API}/${userId}`,

      {},

      {
        Authorization: `Bearer ${token}`,
      }

    );

    result = response.data;

    toast.success(response.data.message);

  }

  catch (error) {

    console.log(error);

    toast.error(
      error?.response?.data?.message ||
      "Unable to update status."
    );

  }

  toast.dismiss(toastId);

  return result;

};

// ======================================================
// Send Notification
// ======================================================

export const sendNotification = async (
  token,
  data
) => {
  const toastId = toast.loading(
    "Sending notification..."
  );

  let result = null;

  try {
    const response = await apiConnector(
      "POST",
      SEND_NOTIFICATION_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    result = response.data;

    toast.success(response.data.message);
  } catch (error) {
    console.log(error);

    toast.error(
      error?.response?.data?.message ||
        "Unable to send notification."
    );
  }

  toast.dismiss(toastId);

  return result;
};



export const deleteUser = async (
  token,
  userId
) => {

  const toastId = toast.loading(
    "Deleting user..."
  );

  let result = null;

  try {

    const response = await apiConnector(

      "DELETE",

      `${DELETE_USER_API}/${userId}`,

      {},

      {
        Authorization: `Bearer ${token}`,
      }

    );

    result = response.data;
    //console.log("Ye data aa rha hai "+response.data.users);

    toast.success(response.data.message);

  }

  catch (error) {

    console.log(error);

    toast.error(
      error?.response?.data?.message ||
      "Unable to delete user."
    );

  }

  toast.dismiss(toastId);

  return result;

};


// ======================================================
// Published Courses
// ======================================================

export const getPublishedCourses = async (
  token,
  userId
) => {

  let result = null;

  try {

    const response = await apiConnector(

      "GET",

      `${GET_PUBLISHED_COURSES_API}/${userId}/published-courses`,

      null,

      {

        Authorization: `Bearer ${token}`,

      }

    );

    result = response.data;

  }

 catch (error) {
  console.log(error);

  if (error?.response?.status !== 401) {
    toast.error(
      error?.response?.data?.message ||
      "Unable to fetch published courses."
    );
  }
}

  return result;

};


// ======================================================
// Instructor Students
// ======================================================

export const getInstructorStudents = async (
  token,
  userId
) => {

  let result = null;

  try {

    const response = await apiConnector(

      "GET",

      `${GET_INSTRUCTOR_STUDENTS_API}/${userId}/students`,

      null,

      {
        Authorization: `Bearer ${token}`,
      }

    );

    result = response.data;

  }

  catch (error) {
  console.log(error);

  if (error?.response?.status !== 401) {
    toast.error(
      error?.response?.data?.message ||
      "Unable to fetch students."
    );
  }
}

  return result;

};


// ======================================================
// Dashboard Stats
// ======================================================

export const getDashboardStats = async (token) => {
  let result = null;

  try {
    const response = await apiConnector(
      "GET",
      GET_DASHBOARD_STATS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    result = response.data;
  } catch (error) {
  console.log(error);

  if (error?.response?.status !== 401) {
    toast.error(
      error?.response?.data?.message ||
      "Unable to fetch dashboard stats."
    );
  }
}

  return result;
};