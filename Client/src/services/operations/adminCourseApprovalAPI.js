import { toast } from "react-hot-toast";

import { apiConnector } from "../apiConnector";

import { adminCourseApprovalEndpoints } from "../apis";
import { adminUserManagementEndpoints } from "../apis";

const {
  GET_PENDING_COURSES_API,
  APPROVE_COURSE_API,
  REJECT_COURSE_API,
  GET_APPROVED_COURSES_API,
  GET_REJECTED_COURSES_API,
} = adminCourseApprovalEndpoints;

const {
  GET_DASHBOARD_STATS_API,
} = adminUserManagementEndpoints;

// =============================
// Get Pending Courses
// =============================

export const getPendingCourses = async (token) => {
  let result = null;

  try {
    const response = await apiConnector(
      "GET",
      GET_PENDING_COURSES_API,
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
        "Unable to fetch pending courses."
    );
  }
}

  return result;
};

// =============================
// Approve Course
// =============================

export const approveCourse = async (
  courseId,
  token
) => {
  let result = null;

  const toastId = toast.loading("Approving Course...");

  try {
    const response = await apiConnector(
      "PATCH",
      `${APPROVE_COURSE_API}/${courseId}/approve`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    result = response.data;

    toast.success("Course Approved");
  } catch (error) {
    console.log(error);

    toast.error(
      error?.response?.data?.message ||
        "Unable to approve course."
    );
  }

  toast.dismiss(toastId);

  return result;
};

// =============================
// Reject Course
// =============================

export const rejectCourse = async (
  courseId,
  reason,
  token
) => {
  let result = null;

  const toastId = toast.loading("Rejecting Course...");

  try {
    const response = await apiConnector(
      "PATCH",
      `${REJECT_COURSE_API}/${courseId}/reject`,
      {
        reason,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    result = response.data;

    toast.success("Course Rejected");
  } catch (error) {
    console.log(error);

    toast.error(
      error?.response?.data?.message ||
        "Unable to reject course."
    );
  }

  toast.dismiss(toastId);

  return result;
};


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
  }

  return result;
};


export const getApprovedCourses = async (token) => {
  let result = null;

  try {
    const response = await apiConnector(
      "GET",
      GET_APPROVED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    result = response.data;
  } catch (error) {
  console.log(error);

  if (error?.response?.status !== 401) {
    toast.error("Unable to fetch approved courses");
  }
}

  return result;
};


export const getRejectedCourses = async (token) => {
  let result = null;

  try {
    const response = await apiConnector(
      "GET",
      GET_REJECTED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    result = response.data;
  }catch (error) {
  console.log(error);

  if (error?.response?.status !== 401) {
    toast.error("Unable to fetch rejected courses");
  }
}

  return result;
};