import { apiConnector } from "../apiConnector";
import { couponEndpoints } from "../apis";

const {
  GET_ACTIVE_COUPON_API,
  GET_COUPONS_API,
  CREATE_COUPON_API,
  UPDATE_COUPON_API,
  DELETE_COUPON_API,

} = couponEndpoints;

export const getActiveCoupon = async () => {
  try {
    const response = await apiConnector(
      "GET",
      GET_ACTIVE_COUPON_API
    );

    if (!response.data.success) {
      return null;
    }

    return response.data.data;

  } catch (error) {
    console.log("GET_ACTIVE_COUPON_ERROR", error);
    return null;
  }
};

export const getCoupons = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_COUPONS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    return response.data;
  } catch (error) {
    console.log("GET_COUPONS_ERROR", error);
    throw error;
  }
};

export const createCoupon = async (data, token) => {
  try {
    const response = await apiConnector(
      "POST",
      CREATE_COUPON_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    return response.data;
  } catch (error) {
    console.log("CREATE_COUPON_ERROR", error);
    throw error;
  }
};

export const updateCoupon = async (
  couponId,
  data,
  token
) => {
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_COUPON_API(couponId),
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    return response.data;
  } catch (error) {
    console.log("UPDATE_COUPON_ERROR", error);
    throw error;
  }
};

export const deleteCoupon = async (
  couponId,
  token
) => {
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_COUPON_API(couponId),
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    return response.data;
  } catch (error) {
    console.log("DELETE_COUPON_ERROR", error);
    throw error;
  }
};