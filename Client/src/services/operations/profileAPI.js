
import { toast } from "react-hot-toast"

import { setLoading, setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  GET_USER_ORDERS_API,
  GET_INSTRUCTOR_DATA_API,
} = profileEndpoints

// 1. GET USER DETAILS (FIXED)
export function getUserDetails(token) {
  return async (dispatch) => {
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      })

      console.log("GET_USER_DETAILS API RESPONSE............", response)

      if (!response?.data?.success) {
        throw new Error(response?.data?.message)
      }

    const userImage = response.data.data?.image
  ? response.data.data.image
  : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`;

      dispatch(setUser({ ...response.data.data, image: userImage }))
    } catch (error) {
      console.log("GET_USER_DETAILS API ERROR............", error)

      // logout only if token invalid (optional improvement)
      dispatch(logout())

      toast.error("Could Not Get User Details")
    } finally {
      dispatch(setLoading(false))
    }
  }
}

// 2. GET USER ENROLLED COURSES (FIXED)
export async function getUserEnrolledCourses(token) {
  let result = []
  try {
    console.log("Calling ENROLLED COURSES API...")

    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!response?.data?.success) {
      throw new Error(response?.data?.message)
    }

    result = response.data.data
  } catch (error) {
    console.log("ENROLLED COURSES ERROR............", error)
    toast.error("Could Not Get Enrolled Courses")
  }

  return result
}

// 4. GET USER ORDERS
export async function getUserOrders(token) {
  let result = []
  try {
    const response = await apiConnector("GET", GET_USER_ORDERS_API, null, {
      Authorization: `Bearer ${token}`,
    })

    if (!response?.data?.success) {
      throw new Error(response?.data?.message)
    }

    result = response.data.data
  } catch (error) {
    console.log("GET_USER_ORDERS ERROR............", error)
    toast.error("Could Not Get Purchase History")
  }

  return result
}

// 3. GET INSTRUCTOR DATA (FIXED)
export async function getInstructorData(token) {
  let result = []
  try {
    const response = await apiConnector(
      "GET",
      GET_INSTRUCTOR_DATA_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )

    console.log("GET_INSTRUCTOR_API_RESPONSE", response)

    result = response?.data?.courses || []
  } catch (error) {
    console.log("GET_INSTRUCTOR_API ERROR", error)
    toast.error("Could not Get Instructor Data")
  }

  return result
}

