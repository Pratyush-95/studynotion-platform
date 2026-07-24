
const BASE_URL = "http://localhost:5000/api/v1";


// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  GOOGLE_AUTH_API: BASE_URL + "/auth/google",
  LOGOUT_API: BASE_URL + "/auth/logout",
  REFRESH_TOKEN_API: BASE_URL + "/auth/refresh-token",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API:
    BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API:
    BASE_URL + "/profile/instructorDashboard",

  REQUEST_ACCOUNT_DELETION_API:
    BASE_URL + "/profile/request-account-deletion",

  CANCEL_ACCOUNT_DELETION_API:
    BASE_URL + "/profile/cancel-account-deletion",
  GET_USER_ORDERS_API: BASE_URL + "/payment/getOrders",

  CHECK_PHONE_API: BASE_URL + "/profile/check-phone",
};

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API:
    BASE_URL + "/payment/sendPaymentSuccessEmail",
  BACKFILL_ORDERS_API: BASE_URL + "/payment/backfillMyOrders",
};



export const couponEndpoints = {

  CREATE_COUPON_API:
    BASE_URL + "/coupon/create",

  GET_COUPONS_API:
    BASE_URL + "/coupon",

  GET_ACTIVE_COUPON_API:
    BASE_URL + "/coupon/active",

   UPDATE_COUPON_API: (couponId) =>
    BASE_URL + `/coupon/${couponId}`,

  DELETE_COUPON_API: (couponId) =>
    BASE_URL + `/coupon/${couponId}`,

  VALIDATE_COUPON_API:
    BASE_URL + "/coupon/validate",

  APPLY_COUPON_API:
    BASE_URL + "/coupon/apply",

  

};



// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  COURSE_CATEGORIES_API:
    BASE_URL + "/course/showAllCategories",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API:
    BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API:
    BASE_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API:
    BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
};

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
};

// CATEGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories",
};

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API:
    BASE_URL + "/course/getCategoryPageDetails",
};

// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
};

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API:
    BASE_URL + "/profile/updateDisplayPicture",

  UPDATE_PROFILE_API:
    BASE_URL + "/profile/updateProfile",

  CHANGE_PASSWORD_API:
    BASE_URL + "/auth/changepassword",

  DELETE_PROFILE_API:
    BASE_URL + "/profile/deleteProfile",
};


// ========================================
// Admin User Management
// ========================================

export const adminUserManagementEndpoints = {

  SEARCH_USER_API:
    BASE_URL + "/admin-user/search-user",

  VIEW_USER_PROFILE_API:
    BASE_URL + "/admin-user/user-profile",

  TOGGLE_USER_STATUS_API:
    BASE_URL + "/admin-user/toggle-user-status",

  SEND_NOTIFICATION_API:
    BASE_URL + "/admin-user/send-notification",

  DELETE_USER_API:
    BASE_URL + "/admin-user/delete-user",

  GET_PUBLISHED_COURSES_API:
    BASE_URL + "/admin-user/instructor",

  GET_INSTRUCTOR_STUDENTS_API:
    BASE_URL + "/admin/instructor",

  GET_DASHBOARD_STATS_API:
    BASE_URL + "/admin/dashboard-stats",

};


// ========================================
// Admin Activity
// ========================================

export const adminActivityEndpoints = {
  GET_RECENT_ACTIVITIES_API:
    BASE_URL + "/admin/recent-activities",

  DELETE_ACTIVITY_API:
    BASE_URL + "/admin/activity",

  MARK_ACTIVITY_READ_API:
    BASE_URL + "/admin/activity",
};


// ========================================
// Admin Course Approval
// ========================================

export const adminCourseApprovalEndpoints = {
  GET_PENDING_COURSES_API:
    BASE_URL + "/admin/pending-courses",

  APPROVE_COURSE_API:
    BASE_URL + "/admin/courses",

  REJECT_COURSE_API:
    BASE_URL + "/admin/courses",

  GET_APPROVED_COURSES_API:
    BASE_URL + "/admin/approved-courses",

  GET_REJECTED_COURSES_API:
    BASE_URL + "/admin/rejected-courses",
};