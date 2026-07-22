import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { deleteCoupon } from "../../../../services/operations/couponAPI";

function DeleteCouponModal({
  coupon,
  onClose,
  fetchCoupons,
}) {
  const { token } = useSelector((state) => state.auth);

  const handleDeleteCoupon = async () => {
    try {
      const response = await deleteCoupon(coupon._id, token);

      if (response.success) {
        toast.success("Coupon deleted successfully");
        await fetchCoupons();
        onClose();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete coupon"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[380px] overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-richblack-700 px-5 py-3">
          <h2 className="text-lg font-semibold text-richblack-5">
            Delete Coupon
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-1 text-richblack-300 transition-all hover:bg-richblack-700 hover:text-richblack-5"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6 text-center">

          <div className="mb-3 text-4xl">
            ⚠️
          </div>

          <h3 className="text-lg font-semibold text-richblack-5">
            Are you sure?
          </h3>

          <p className="mt-3 text-sm text-richblack-200">
            You are about to permanently delete
          </p>

          <p className="mt-2 text-base font-bold tracking-wide text-yellow-50">
            {coupon?.code}
          </p>

          <p className="mt-4 text-sm text-pink-200">
            This action cannot be undone.
          </p>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-richblack-700 px-5 py-3">

          <button
            onClick={onClose}
            className="rounded-lg border border-richblack-600 px-5 py-2 text-sm font-medium text-richblack-100 transition-all hover:bg-richblack-700"
          >
            No
          </button>

          <button
            onClick={handleDeleteCoupon}
            className="rounded-lg bg-pink-200 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-pink-300"
          >
            Yes, Delete
          </button>

        </div>
      </div>
    </div>
  );
}

export default DeleteCouponModal;