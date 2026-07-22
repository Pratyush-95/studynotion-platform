import {
  VscGift,
  VscCheck,
  VscWarning,
  VscGraph,
} from "react-icons/vsc";

function CouponStats({
  totalCoupons,
  activeCoupons,
  expiredCoupons,
  totalUses,
}) {
  const stats = [
    {
      title: "Total Coupons",
      value: totalCoupons,
      icon: <VscGift />,
      bg: "bg-richblack-700",
      iconColor: "text-yellow-50",
    },
    {
      title: "Active Coupons",
      value: activeCoupons,
      icon: <VscCheck />,
      bg: "bg-richblack-700",
      iconColor: "text-caribbeangreen-100",
    },
    {
      title: "Expired Coupons",
      value: expiredCoupons,
      icon: <VscWarning />,
      bg: "bg-richblack-700",
      iconColor: "text-pink-200",
    },
    {
      title: "Total Uses",
      value: totalUses,
      icon: <VscGraph />,
      bg: "bg-richblack-700",
      iconColor: "text-blue-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border border-richblack-700 bg-richblack-800 p-6 transition-all duration-300 hover:border-yellow-50 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-richblack-300">
                {item.title}
              </p>

              <h2 className="mt-3 text-4xl font-bold text-richblack-5">
                {item.value}
              </h2>
            </div>

            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${item.bg}`}
            >
              <div className={`text-3xl ${item.iconColor}`}>
                {item.icon}
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}

export default CouponStats;