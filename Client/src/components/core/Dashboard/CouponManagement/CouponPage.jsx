import { useState, useEffect, } from "react";
import { FiPlus } from "react-icons/fi";

import CouponStats from "./CouponStats";
import CouponFilters from "./CouponFilters";
import CouponTable from "./CouponTable";
import CreateCouponModal from "./CreateCouponModal";
import EditCouponModal from "./EditCouponModal";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getCoupons } from "../../../../services/operations/couponAPI";
import DeleteCouponModal from "./DeleteCouponModal";

function CouponPage() {

    const { token } = useSelector((state) => state.auth);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

    // ---------------- Fetch Coupons ----------------

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const response = await getCoupons(token);

      if (response.success) {
        setCoupons(response.data);
      }

    } catch (error) {
      console.log(error);
         if (error?.response?.status !== 401) {
        toast.error("Failed to load coupons");
    }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (token) {
      fetchCoupons();
    }
  }, [token]);


  // ---------------- Coupon Stats ----------------

const totalCoupons = coupons.length;

const activeCoupons = coupons.filter(
  (coupon) =>
    coupon.isActive &&
    new Date(coupon.expiryDate) >= new Date()
).length;

const expiredCoupons = coupons.filter(
  (coupon) =>
    new Date(coupon.expiryDate) < new Date()
).length;

const totalUses = coupons.reduce(
  (total, coupon) => total + (coupon.usedCount || 0),
  0
);


const filteredCoupons = coupons.filter((coupon) => {
  // Search
  const matchesSearch =
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchTerm.toLowerCase());

  // Status
  let matchesStatus = true;

  if (statusFilter === "Active") {
    matchesStatus =
      coupon.isActive &&
      new Date(coupon.expiryDate) >= new Date();
  } else if (statusFilter === "Inactive") {
    matchesStatus = !coupon.isActive;
  } else if (statusFilter === "Expired") {
    matchesStatus =
      new Date(coupon.expiryDate) < new Date();
  }

  // Type
  let matchesType = true;

  if (typeFilter !== "All") {
    matchesType = coupon.discountType === typeFilter;
  }

  return matchesSearch && matchesStatus && matchesType;
});

  return (
    <div className="w-full">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

        <div>

          <h1 className="text-3xl font-bold text-richblack-5">
            Coupon Management
          </h1>

          <p className="mt-2 text-richblack-300">
            Create, update and manage platform coupons.
          </p>

        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-yellow-50 px-5 py-3 font-semibold text-richblack-900 transition-all duration-200 hover:scale-95"
        >
          <FiPlus />
          Create Coupon
        </button>

      </div>

      {/* Stats */}

      <div className="mt-8">

         <CouponStats 
          totalCoupons={totalCoupons}
          activeCoupons={activeCoupons}
          expiredCoupons={expiredCoupons}
          totalUses={totalUses}
         /> 

      </div>

      {/* Filters */}

      <div className="mt-8">

        <CouponFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        /> 

      </div>

      {/* Coupon List */}

      <div className="mt-8">

        <CouponTable 
          coupons={filteredCoupons}
          loading={loading}
          fetchCoupons={fetchCoupons}
          setShowEditModal={setShowEditModal}
          setShowDeleteModal={setShowDeleteModal}
          setSelectedCoupon={setSelectedCoupon}
        />

      </div>

      {/* Create Coupon Modal */}

      {
        showCreateModal &&
        (
          <CreateCouponModal
             fetchCoupons={fetchCoupons}
            onClose={() => setShowCreateModal(false)}
           
          />
        )
      }

      {
      showEditModal && (
      <EditCouponModal
      coupon={selectedCoupon}
      fetchCoupons={fetchCoupons}
      onClose={() => {
        setShowEditModal(false);
        setSelectedCoupon(null);
      }}
    />
    )
   }

   {
  showDeleteModal && (
      <DeleteCouponModal
          coupon={selectedCoupon}
          fetchCoupons={fetchCoupons}
          onClose={()=>{
              setShowDeleteModal(false);
              setSelectedCoupon(null);
          }}
      />
  )
}

    </div>
  );
}

export default CouponPage;