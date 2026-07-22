import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FiCopy } from "react-icons/fi";
import { MdLocalOffer } from "react-icons/md";
import toast from "react-hot-toast";

function PromoBanner({ coupon, onClose }) {
  const [copied, setCopied] = useState(false);

  const copyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast.success("Coupon copied!");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Unable to copy coupon");
    }
  };

  const discountText =
    coupon.discountType === "PERCENTAGE"
      ? `${coupon.discountValue}% OFF`
      : `₹${coupon.discountValue} OFF`;

  return (
    <div className="mt-5 w-full rounded-lg border border-richblack-600 bg-richblack-800 px-4 py-5">

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        {/* Left */}
        <div className="flex items-center gap-3">

          <div className="rounded-full bg-yellow-50 p-2 text-richblack-900">
            <MdLocalOffer size={20} />
          </div>

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-richblack-900">
                Limited Time Offer
              </span>

              <span className="text-sm text-richblack-100">
                Get
                <span className="mx-1 font-bold text-yellow-50">
                  {discountText}
                </span>
                using code
              </span>

              <span className="rounded border border-dashed border-yellow-50 px-2 py-1 font-mono text-sm font-bold tracking-widest text-yellow-50">
                {coupon.code}
              </span>

            </div>

            <p className="mt-1 text-xs text-richblack-300">
              Valid till{" "}
              {new Date(coupon.expiryDate).toLocaleDateString()}
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-2">

          <button
            onClick={copyCoupon}
            className="flex items-center gap-2 rounded-md bg-yellow-50 px-3 py-2 text-sm font-semibold text-richblack-900 transition-all duration-200 hover:scale-95"
          >
            <FiCopy />
            {copied ? "Copied" : "Copy"}
          </button>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-richblack-300 transition hover:bg-richblack-700 hover:text-white"
          >
            <IoClose size={20} />
          </button>

        </div>

      </div>

    </div>
  );
}

export default PromoBanner;