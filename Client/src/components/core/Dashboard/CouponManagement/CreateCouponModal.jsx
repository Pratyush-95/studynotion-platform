import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createCoupon } from "../../../../services/operations/couponAPI";

function CreateCouponModal({ onClose, fetchCoupons, }) {

const { token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minimumPurchase: "",
    maximumDiscount: "",
    expiryDate: "",
    maxUses: "",
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateCoupon = async () => {
  try {
    const response = await createCoupon(formData, token);

    if (response.success) {
      toast.success("Coupon created successfully");
        await fetchCoupons();
      onClose();
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    console.log(error);

    toast.error(
      error?.response?.data?.message ||
      "Failed to create coupon"
    );
  }
};

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div className="w-11/12 max-w-3xl rounded-xl border border-richblack-700 bg-richblack-800 shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-richblack-700 px-6 py-4">

          <h2 className="text-2xl font-semibold text-richblack-5"
          >
            Create Coupon
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-richblack-300 hover:bg-richblack-700 hover:text-richblack-5"
          >
            <IoClose size={24} />
          </button>

        </div>

        {/* Body */}

        <div className="max-h-[70vh] overflow-y-auto p-6">

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Coupon Code */}

            <div>
              <label className="mb-2 block text-sm text-richblack-100">
                Coupon Code *
              </label>

              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="WELCOME100"
                className="w-full rounded-lg border border-richblack-600 bg-richblack-700 px-4 py-3 text-richblack-5 outline-none focus:border-yellow-50"
              />
            </div>

            {/* Discount Type */}

            <div>
              <label className="mb-2 block text-sm text-richblack-100">
                Discount Type
              </label>

              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full rounded-lg border border-richblack-600 bg-richblack-700 px-4 py-3 text-richblack-5 outline-none focus:border-yellow-50"
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed Amount</option>
              </select>
            </div>

            {/* Description */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm text-richblack-100">
                Description
              </label>

              <textarea
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Coupon Description..."
                className="w-full rounded-lg border border-richblack-600 bg-richblack-700 px-4 py-3 text-richblack-5 outline-none focus:border-yellow-50"
              />

            </div>

            {/* Discount Value */}

            <div>

              <label className="mb-2 block text-sm text-richblack-100">
                Discount Value
              </label>

              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                placeholder="20"
                className="w-full rounded-lg border border-richblack-600 bg-richblack-700 px-4 py-3 text-richblack-5 outline-none focus:border-yellow-50"
              />

            </div>

            {/* Minimum Purchase */}

            <div>

              <label className="mb-2 block text-sm text-richblack-100">
                Minimum Purchase
              </label>

              <input
                type="number"
                name="minimumPurchase"
                value={formData.minimumPurchase}
                onChange={handleChange}
                placeholder="500"
                className="w-full rounded-lg border border-richblack-600 bg-richblack-700 px-4 py-3 text-richblack-5 outline-none focus:border-yellow-50"
              />

            </div>

            {/* Maximum Discount */}

            <div>

              <label className="mb-2 block text-sm text-richblack-100">
                Maximum Discount
              </label>

              <input
                type="number"
                name="maximumDiscount"
                value={formData.maximumDiscount}
                onChange={handleChange}
                placeholder="1000"
                className="w-full rounded-lg border border-richblack-600 bg-richblack-700 px-4 py-3 text-richblack-5 outline-none focus:border-yellow-50"
              />

            </div>

            {/* Max Uses */}

            <div>

              <label className="mb-2 block text-sm text-richblack-100">
                Maximum Uses
              </label>

              <input
                type="number"
                name="maxUses"
                value={formData.maxUses}
                onChange={handleChange}
                placeholder="100"
                className="w-full rounded-lg border border-richblack-600 bg-richblack-700 px-4 py-3 text-richblack-5 outline-none focus:border-yellow-50"
              />

            </div>

            {/* Expiry */}

            <div>

              <label className="mb-2 block text-sm text-richblack-100">
                Expiry Date
              </label>

              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-richblack-600 bg-richblack-700 px-4 py-3 text-richblack-5 outline-none focus:border-yellow-50"
              />

            </div>

            {/* Active */}

            <div className="flex items-center gap-3">

              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-5 w-5"
              />

              <label className="text-richblack-50">
                Active Coupon
              </label>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-4 border-t border-richblack-700 px-6 py-4">

          <button
            onClick={onClose}
            className="rounded-lg border border-richblack-600 px-6 py-2 text-richblack-100 hover:bg-richblack-700"
          >
            Cancel
          </button>

          <button
             onClick={handleCreateCoupon}
            className="rounded-lg bg-yellow-50 px-6 py-2 font-semibold text-richblack-900 hover:bg-yellow-100"
          >
            Create Coupon
          </button>

        </div>

      </div>

    </div>
  );
}

export default CreateCouponModal;