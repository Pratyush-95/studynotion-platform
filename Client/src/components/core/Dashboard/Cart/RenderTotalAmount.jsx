import { useState,useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import IconBtn from "../../../common/IconBtn"
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI"
import { apiConnector } from "../../../../services/apiconnector";
import { couponEndpoints } from "../../../../services/apis";
import { toast } from "react-hot-toast";


export default function RenderTotalAmount() {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const { total, cart } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(total);
  const [loading, setLoading] = useState(false);
  const [invalidToastShown, setInvalidToastShown] = useState(false);
 
  useEffect(() => {
    setFinalAmount(total);
  }, [total]);

  const handleApplyCoupon = async () => {

  if (!couponCode) {
    return toast.error("Enter Coupon Code");
  }

  try {

    setLoading(true);

    const response = await apiConnector(
      "POST",
      couponEndpoints.APPLY_COUPON_API,
      {
        code: couponCode,
        amount: total,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    setDiscount(response.data.data.discount);

    setFinalAmount(response.data.data.finalAmount);

    toast.success("Coupon Applied");

  }

  catch (error) {

    toast.error(error.response?.data?.message || error.message);

  }

  finally {

    setLoading(false);

  }

};

   // =============================
// Remove Applied Coupon
// =============================
const handleRemoveCoupon = () => {

  setCouponCode("");

  setDiscount(0);

  setFinalAmount(total);

  toast.success("Coupon Removed");

};

  const handleOpenPayment = () => {
    const courses = cart.map((course) => course._id)
     const appliedCoupon = discount > 0 ? couponCode : "";
    if (token) {
      buyCourse(token, courses, user, navigate, dispatch,couponCode)
      return
    }
    // if not logged in, redirect to login page
    navigate("/login")
  }

  return (
    <>
      <div className="min-w-[320px] rounded-md border border-richblack-700 bg-richblack-800 p-6">

  <p className="text-sm text-richblack-300">
    Subtotal
  </p>

  <p className="text-3xl font-semibold text-yellow-100">
    ₹ {total}
  </p>

  <div className="mt-5">

    <input
      type="text"
      placeholder="Enter Coupon Code"
      value={couponCode}
      maxLength={15}
      readOnly={discount > 0}
      onChange={(e) => {
        const input = e.target.value.toUpperCase();
        const filtered = input.replace(/[^A-Z0-9_]/g, "");

        if (input !== filtered && !invalidToastShown) {
          toast.error(
            "Coupon code can contain only letters, numbers and underscore (_)."
        );
        setInvalidToastShown(true);

         setTimeout(() => {
          setInvalidToastShown(false);
        }, 2000);
      }

       setCouponCode(filtered);
      }
      } 
      className="w-full rounded-md border border-richblack-600 bg-richblack-700 px-3 py-2 text-white outline-none"
    />

    <button
      onClick={handleApplyCoupon}
      disabled={loading || discount > 0}
      className="mt-3 w-full rounded-md bg-yellow-50 py-2 font-semibold text-black"
    >
      {loading ? "Applying..." : discount > 0 ? "Coupon Applied ✓" : "Apply Coupon"}
    </button>

  </div>

  {
    discount > 0 && (

      <div className="mt-5 rounded-md border border-richblack-600 bg-richblack-700 p-4">

        <p className="text-xl font-semibold text-caribbeangreen-100">
          Discount : ₹ {discount}
        </p>

        <p className="mt-2 text-2xl font-bold text-yellow-100">
          Payable : ₹ {finalAmount}
        </p>

      </div>

    )
  }

  {
  discount > 0 && (

    <button
      onClick={handleRemoveCoupon}
      className="mt-3 w-full rounded-md border border-pink-300 py-2 font-semibold text-pink-100 transition-all duration-200 hover:bg-pink-300 hover:text-richblack-900"
    >
      Remove Coupon
    </button>

  )
}

  <IconBtn
    text="Buy Now"
    onClick={handleOpenPayment}
    customClasses="mt-5 w-full justify-center"
  />

  {/* {
  discount > 0 && (
    <p className="mt-2 text-sm font-medium text-caribbeangreen-100">
      ✓ Coupon "{couponCode}" Applied
    </p>
  )
} */}

</div>
      {/* Payment modal removed — Buy Now now opens Razorpay directly */}
    </>
  )
}