import { FiEdit2, FiTrash2 } from "react-icons/fi";

function CouponTable({ coupons,  loading,
  fetchCoupons,setShowEditModal, setShowDeleteModal,setSelectedCoupon}) {

  if (loading) {
  return (
    <div className="flex justify-center py-10">
      <p className="text-richblack-100">Loading coupons...</p>
    </div>
  );
}

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800">

      {/* Table Header */}

      <div className="grid grid-cols-7 gap-4 border-b border-richblack-700 bg-richblack-700 px-6 py-4 text-sm font-semibold text-richblack-25">

        <p>Coupon</p>
        <p>Discount</p>
        <p>Min Purchase</p>
        <p>Expiry</p>
        <p>Status</p>
        <p>Used</p>
        <p className="text-center">Actions</p>

      </div>

      {
        coupons.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-20">

            <div className="mb-4 text-6xl">
              🎟️
            </div>

            <h2 className="text-2xl font-semibold text-richblack-5">
              No Coupons Found
            </h2>

            <p className="mt-2 text-richblack-300">
              Click on "Create Coupon" to create your first coupon.
            </p>

          </div>

        ) : (

          coupons.map((coupon) => (

            <div
              key={coupon._id}
              className="grid grid-cols-7 items-center gap-4 border-b border-richblack-700 px-6 py-5 text-richblack-25 transition-all duration-200 hover:bg-richblack-700"
            >

              <div>
                <h3 className="font-semibold">
                  {coupon.code}
                </h3>

                <p className="mt-1 text-xs text-richblack-300">
                  {coupon.description}
                </p>
              </div>

              <p>{coupon.discountValue}</p>

              <p>₹ {coupon.minimumPurchase}</p>

              <p>
                {new Date(coupon.expiryDate).toLocaleDateString()}
              </p>

              <div>

                <span className="rounded-full bg-caribbeangreen-700 px-3 py-1 text-xs text-caribbeangreen-25">
                  Active
                </span>

              </div>

              <p>
                {coupon.usedCount}/{coupon.maxUses}
              </p>

              <div className="flex justify-center gap-4">

                <button
                onClick={() => {
                    setSelectedCoupon(coupon);
                    setShowEditModal(true);
                }}
                className="text-yellow-50 transition-all hover:scale-110">
                    <FiEdit2 size={20} />
                </button>

                <button className="text-pink-200 hover:scale-110 transition-all"

                   onClick={() => {
                    setSelectedCoupon(coupon);
                    setShowDeleteModal(true);
                }}
                className="text-pink-200 hover:scale-110 transition-all"
                >

                  <FiTrash2 size={20} />

                </button>

              </div>

            </div>

          ))

        )

      }

    </div>
  );
}

export default CouponTable;