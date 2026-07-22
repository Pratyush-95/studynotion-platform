import { FiCopy } from "react-icons/fi";
import { toast } from "react-hot-toast";

function CouponCard({ coupon }) {
  const handleCopyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      toast.success(
        "Coupon copied! Go to your Cart and apply it before checkout."
      );
    } catch (error) {
      toast.error("Failed to copy coupon");
    }
  };

  return (
    <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-6 shadow-md transition-all hover:border-yellow-50">

      {/* Coupon Code */}

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold text-yellow-50">
          {coupon.code}
        </h2>

        <button
          onClick={handleCopyCoupon}
          className="rounded-md bg-richblack-700 p-2 transition hover:bg-richblack-600"
          title="Copy Coupon"
        >
          <FiCopy size={18} className="text-richblack-5" />
        </button>

      </div>

      {/* Description */}

      <p className="mt-3 text-richblack-100">
        {coupon.description}
      </p>

      {/* Coupon Details */}

      <div className="mt-5 space-y-2 text-sm text-richblack-50">

        <p>
          <span className="font-semibold">Discount :</span>{" "}
          {coupon.discountType === "PERCENTAGE"
            ? `${coupon.discountValue}%`
            : `₹${coupon.discountValue}`}
        </p>

        <p>
          <span className="font-semibold">Minimum Purchase :</span>{" "}
          ₹{coupon.minimumPurchase}
        </p>

        {coupon.discountType === "PERCENTAGE" && (
          <p>
            <span className="font-semibold">Maximum Discount :</span>{" "}
            ₹{coupon.maximumDiscount}
          </p>
        )}

        <p>
          <span className="font-semibold">Expires :</span>{" "}
          {new Date(coupon.expiryDate).toLocaleDateString()}
        </p>

      </div>

      {/* How To Use */}

      <div className="mt-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">

        <h3 className="font-semibold text-yellow-50">
          💡 How to Use
        </h3>

        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-richblack-50">
          <li>Add your desired course(s) to your Cart.</li>
          <li>Open the Cart page.</li>
          <li>Paste this coupon code in the <b>Apply Coupon</b> section.</li>
          <li>Click <b>Apply</b> and proceed to payment.</li>
        </ul>

      </div>

    </div>
  );
}

export default CouponCard;