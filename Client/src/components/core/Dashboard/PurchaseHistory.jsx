
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getUserOrders } from "../../../services/operations/profileAPI"
import { apiConnector } from "../../../services/apiconnector"
import { studentEndpoints } from "../../../services/apis"

export default function PurchaseHistory() {
  const token = useSelector((state) => state.auth.token)
  const navigate = useNavigate()

  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)

      try {
        const data = await getUserOrders(token)

        if (mounted) {
          setPurchases(data || [])
        }
      } catch (error) {
        console.error("Purchase history error:", error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    if (token) {
      load()
    } else {
      setLoading(false)
    }

    return () => {
      mounted = false
    }
  }, [token])

  const totalSpent = purchases.reduce(
    (acc, order) => acc + (order.amount || 0),
    0
  )

  const totalCourses = purchases.reduce(
    (acc, order) => acc + (order.courses?.length || 0),
    0
  )

  const totalOrders = purchases.length

  const formatDateTime = (dateStr) => {
    if (!dateStr) return ""

    const d = new Date(dateStr)

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d)
  }

  if (loading) {
    return (
      <div className="grid min-h-[300px] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-richblack-5">
          Purchase History
        </h1>

        <p className="mt-2 text-richblack-300">
          View all your purchased courses and transactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-5">
          <p className="text-sm text-richblack-300">Total Spent</p>

          <h2 className="mt-2 text-3xl font-bold text-yellow-50">
            ₹{totalSpent}
          </h2>
        </div>

        <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-5">
          <p className="text-sm text-richblack-300">
            Courses Purchased
          </p>

          <h2 className="mt-2 text-3xl font-bold text-richblack-5">
            {totalCourses}
          </h2>
        </div>

        <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-5">
          <p className="text-sm text-richblack-300">Orders</p>

          <h2 className="mt-2 text-3xl font-bold text-richblack-5">
            {totalOrders}
          </h2>
        </div>
      </div>

      {/* Empty State */}
      {purchases.length === 0 ? (
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-8 text-center">
          <h3 className="text-xl font-semibold text-richblack-5">
            No Purchases Yet
          </h3>

          <p className="mt-2 text-richblack-300">
            Start learning by purchasing your first course.
          </p>

          <button
            className="mt-5 rounded-md bg-yellow-50 px-5 py-2 font-medium text-richblack-900"
            onClick={async () => {
              try {
                await apiConnector(
                  "POST",
                  studentEndpoints.BACKFILL_ORDERS_API,
                  null,
                  {
                    Authorization: `Bearer ${token}`,
                  }
                )

                const data = await getUserOrders(token)
                setPurchases(data || [])
              } catch (error) {
                console.error(error)
              }
            }}
          >
            Restore Purchases
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {purchases.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border border-richblack-700 bg-richblack-800 p-6 transition-all duration-300 hover:border-yellow-50"
            >
              {/* Order Header */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-caribbeangreen-100/20 px-3 py-1 text-xs font-semibold text-caribbeangreen-100 border border-caribbeangreen-100">
                      Completed
                    </span>

                    <h3 className="text-lg font-semibold text-richblack-5">
                      Order ID: #{order.orderId?.slice(-6)}
                    </h3>
                  </div>

                  <p className="mt-2 text-sm text-richblack-300">
                    Purchased on {formatDateTime(order.createdAt)}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-sm text-richblack-300">
                    Total Amount
                  </p>

                  <h2 className="text-2xl font-bold text-yellow-50">
                    ₹{order.amount}
                  </h2>
                </div>
              </div>

              {/* Courses */}
              <div className="mt-6 space-y-4">
                {order.courses?.map((course) => (
                  <div
                    key={course._id}
                    className="flex flex-col gap-4 rounded-lg bg-richblack-900 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="h-20 w-44 rounded-xl object-cover  flex-shrink-0"
                      />

                      <div>
                        <h4 className="font-semibold text-richblack-5">
                          {course.courseName}
                        </h4>

                        <p className="mt-1 text-sm text-richblack-300">
                          Purchased Course
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-yellow-50">
                          {/* //₹{course.price} */}
                        </div>

                        <div className="mt-1 text-xs text-green-400">
                          Completed
                        </div>
                      </div>

                           <button
  onClick={() => {
    const firstSection = course?.courseContent?.[0]
    const firstSubSection =
      firstSection?.subSection?.[0]

    if (!firstSection || !firstSubSection) {
      navigate("/dashboard/enrolled-courses")
      return
    }

    navigate(
      `/view-course/${course._id}/section/${firstSection._id}/sub-section/${firstSubSection._id}`
    )
  }}
  className="
    rounded-lg
    bg-yellow-50
    px-4
    py-2
    text-sm
    font-semibold
    text-richblack-900
    hover:bg-yellow-100
    transition-all
  "
>
  Continue Learning
</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

